import { Message } from 'discord.js';
import { IClient } from './client';

export interface ICommand {
  name: string;
  description: string;
  aliases?: string[];
  execute(client: IClient<ICommand>, msg: Message, args: string[]): Promise<unknown>;
}

export interface ICommandFlag extends ICommand {
  validator: (args: string[]) => boolean;
}
