import { MessageFlags, SlashCommandBuilder } from 'discord.js';

import { ISlashCommand } from '@/types/slashCommand';
import GameRepository from '@/repositories/Game.repository';
import DiscordUserRepository from '@/repositories/DiscordUser.repository';

export default {
  data: new SlashCommandBuilder()
    .setName('player')
    .setDescription('Adiciona ou remove um usuário do Discord na lista do jogo.')
    .addStringOption((option) => (
      option.setName('action')
        .setDescription('Ação que deverá ser tomada.')
        .setRequired(true)
        .addChoices([
          { name: 'Adicionar', value: 'add' },
        ])
    ))
    .addStringOption((option) => (
      option.setName('game')
        .setDescription('Nome do jogo.')
        .setRequired(true)
        .setMaxLength(255)
    ))
    .addUserOption((option) => (
      option.setName('player')
        .setDescription('Jogador.')
        .setRequired(true)
    )),
  async execute(interaction) {
    const action = interaction.options.getString('action', true);
    const gameName = interaction.options.getString('game', true);
    const player = interaction.options.getUser('player', true);

    const game = await GameRepository.searchByName(gameName);

    if (action === 'add') {
      if (!game) {
        await interaction.reply({ content: `Não existe um jogo na lista chamado **${gameName}**.`, flags: MessageFlags.Ephemeral });

        return;
      }

      const discordUser = await DiscordUserRepository.firstOrCreate(player.id);
      const alreadyInGamePlayerList = discordUser.playersOnGames.find(
        (playerOnGame) => playerOnGame.gameId === game.id,
      );

      if (alreadyInGamePlayerList) {
        await interaction.reply({ content: `O jogador já está na lista do jogo **${game.name}**.`, flags: MessageFlags.Ephemeral });

        return;
      }

      await DiscordUserRepository.addGame(discordUser.id, game.id);

      await interaction.reply({ content: `O jogador <@${player.id}> foi adicionado na lista do jogo **${gameName}** com sucesso!` });
    }
  },
} as ISlashCommand;
