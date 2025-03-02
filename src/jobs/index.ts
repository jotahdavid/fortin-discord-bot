import path from 'path';

import Schedule from 'node-schedule';

import { IClient } from '@/types/client';
import { ICommand, ICommandFlag } from '@/types/command';
import { ISlashCommand } from '@/types/slashCommand';
import { getAllFiles } from '@/helpers/getAllFiles';
import { IJob } from '@/types/job';

export function prepareJobs(client: IClient<ICommand | ICommandFlag, ISlashCommand>) {
  const jobsPath = path.join(__dirname);
  const jobsFiles = getAllFiles(jobsPath)
    .filter((filePath) => filePath.endsWith('.js') || filePath.endsWith('.ts'))
    .map((filePath) => ({
      path: filePath,
    }));

  const isJob = (value: any): value is IJob => value !== undefined && 'schedule' in value && 'execute' in value;

  jobsFiles.forEach(async (file) => {
    if (file.path === __filename) {
      return;
    }

    const job: unknown = (await import(file.path)).default;
    if (isJob(job)) {
      Schedule.scheduleJob(job.schedule, () => job.execute(client));
    } else {
      console.log(`[AVISO] O comando no arquivo "${file.path}" está faltando a propriedade "schedule" ou "execute".`);
    }
  });
}
