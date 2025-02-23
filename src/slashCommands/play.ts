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
    )),
  async execute(interaction) {
    const gameSearch = interaction.options.getString('game', true);

    const game = await GameRepository.searchByName(gameSearch);

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
} as ISlashCommand;
