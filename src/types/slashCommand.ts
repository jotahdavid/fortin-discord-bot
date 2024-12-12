import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface ISlashCommand {
  data: SlashCommandBuilder,
  aliases?: string[];
  execute(interaction: CommandInteraction): Promise<unknown>;
}
