import { Message } from 'discord.js';
import { IClient } from './client';

export interface ICommand {
  name: string;
  aliases?: string[];
  execute(client: IClient<ICommand>, msg: Message, args: string[]): Promise<unknown>;
}
