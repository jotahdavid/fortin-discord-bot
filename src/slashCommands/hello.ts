import { SlashCommandBuilder } from 'discord.js';
import { ISlashCommand } from '@/types/slashCommand';

export default {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Diz olá!'),
  async execute(interaction) {
    await interaction.reply('Olá!');
  },
} as ISlashCommand;
