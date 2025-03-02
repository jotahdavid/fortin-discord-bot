import { MessageFlags, SlashCommandBuilder } from 'discord.js';

import { ISlashCommand } from '@/types/slashCommand';
import GameRepository from '@/repositories/Game.repository';

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Chama a galera para jogar.')
    .addStringOption((option) => (
      option.setName('game')
        .setDescription('Nome do jogo.')
        .setRequired(true)
        .setMaxLength(255)
        .setAutocomplete(true)
    )),
  async execute(interaction) {
    const gameSearch = interaction.options.getString('game', true);

    const game = await GameRepository.searchByName(gameSearch, true);

    if (!game) {
      await interaction.reply({ content: `Não foi possível achar o jogo **${gameSearch}**.`, flags: MessageFlags.Ephemeral });

      return;
    }

    await interaction.reply({ content: `Bora jogar **${game.name}**!` });

    if (interaction.channel?.isSendable()) {
      await interaction.channel.send({
        content: game.playersOnGames.map((playerOnGame) => `<@${playerOnGame.discordUserId}>`).join(' '),
        files: [game.imageUrl],
      });
    }
  },
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);
    const search = focusedOption.value.trim();
    let choices: string[] = [];

    if (focusedOption.name === 'game') {
      const gamesFound = search
        ? await GameRepository.searchByName(search)
        : await GameRepository.findAll(10);

      choices = gamesFound.map((game) => game.name);
    }

    await interaction.respond(
      choices.map((choice) => ({ name: choice, value: choice })),
    );
  },
} as ISlashCommand;
