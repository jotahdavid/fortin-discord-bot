import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import { ISlashCommand } from '@/types/slashCommand';
import GameRepository from '@/repositories/Game.repository';

export default {
  data: new SlashCommandBuilder()
    .setName('games')
    .setDescription('Listar os jogos criados.'),
  async execute(interaction) {
    const games = await GameRepository.findAll();

    const gamesFields = games.map((game) => ({
      name: game.name,
      value: '---',
    }));

    const embed = new EmbedBuilder()
      .setColor(interaction.user.hexAccentColor ?? null)
      .setTitle('🎮 Jogos disponíveis')
      .setThumbnail(interaction.client.user.avatarURL())
      .addFields(gamesFields)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
} as ISlashCommand;
