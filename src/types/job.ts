import { RecurrenceRule } from 'node-schedule';
import { IClient } from './client';
import { ISlashCommand } from './slashCommand';
import { ICommand } from './command';

export interface IJob {
  schedule: RecurrenceRule;
  execute(client: IClient<ICommand, ISlashCommand>): Promise<unknown>;
}
