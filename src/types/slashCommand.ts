import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface ISlashCommand {
  data: SlashCommandBuilder,
  aliases?: string[];
  execute(interaction: ChatInputCommandInteraction): Promise<unknown>;
}
