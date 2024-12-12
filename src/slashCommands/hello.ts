import { SlashCommandBuilder } from 'discord.js';
import { ISlashCommand } from '@/types/slashCommand';

export default {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Diz olá!'),
  async execute(interaction) {
    if (!interaction.isCommand()) return;
    await interaction.reply('Olá!');
  },
} as ISlashCommand;
