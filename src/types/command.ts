import { Message, OmitPartialGroupDMChannel } from 'discord.js';
import { IClient } from './client';
import { ISlashCommand } from './slashCommand';

export interface ICommand {
  name: string;
  description: string;
  aliases?: string[];
  execute(
    client: IClient<ICommand, ISlashCommand>,
    msg: OmitPartialGroupDMChannel<Message>,
    args: string[],
  ): Promise<unknown>;
}

export interface ICommandFlag extends ICommand {
  validator: (args: string[]) => boolean;
}
