import { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface ISlashCommand {
  data: SlashCommandBuilder,
  execute: (interaction: ChatInputCommandInteraction) => Promise<unknown>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<unknown>;
}
