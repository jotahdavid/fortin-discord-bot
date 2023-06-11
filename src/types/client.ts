import { Client, Collection } from 'discord.js';

export interface IClient<C> extends Client {
  commands: Collection<string, C>
  prefix: string;
}
