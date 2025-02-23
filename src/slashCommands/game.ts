import { MessageFlags, SlashCommandBuilder } from 'discord.js';

import { ISlashCommand } from '@/types/slashCommand';
import GameRepository from '@/repositories/Game.repository';
import DiscordUserRepository from '@/repositories/DiscordUser.repository';

export default {
  data: new SlashCommandBuilder()
    .setName('game')
    .setDescription('Adiciona ou remove um jogo na lista de jogos.')
    .addStringOption((option) => (
      option.setName('action')
        .setDescription('Ação que deverá ser tomada.')
        .setRequired(true)
        .addChoices([
          { name: 'Adicionar', value: 'add' },
        ])
    ))
    .addStringOption((option) => (
      option.setName('name')
        .setDescription('Nome do jogo.')
        .setRequired(true)
        .setMaxLength(255)
    ))
    .addStringOption((option) => (
      option.setName('image')
        .setDescription('Url da imagem a ser usado.')
        .setRequired(true)
        .setMaxLength(255)
    )),
  async execute(interaction) {
    const action = interaction.options.getString('action', true);
    const gameName = interaction.options.getString('name', true);
    const imageUrl = interaction.options.getString('image', true);

    const game = await GameRepository.searchByName(gameName);

    if (action === 'add') {
      if (game) {
        await interaction.reply({ content: `Já existe um jogo na lista chamado **${game.name}**.`, flags: MessageFlags.Ephemeral });

        return;
      }

      const discordUser = await DiscordUserRepository.firstOrCreate(interaction.user.id);

      await GameRepository.create({
        name: gameName,
        imageUrl,
        createdByDiscordUserId: discordUser.id,
      });

      await interaction.reply({ content: `O jogo **${gameName}** foi adicionado com sucesso!` });
    }
  },
} as ISlashCommand;
