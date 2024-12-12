import { Client, Collection } from 'discord.js';

export interface IClient<C, SC> extends Client {
  commands: Collection<string, C>
  slashCommands: Collection<string, SC>
  prefix: string;
}
