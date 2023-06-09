import { Client, Message } from 'discord.js';

export interface ICommand {
  name: string;
  aliases?: string[];
  execute(client: Client, msg: Message, args: string[]): Promise<unknown>;
}
