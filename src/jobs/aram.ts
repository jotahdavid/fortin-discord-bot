import { RecurrenceRule } from 'node-schedule';

import { IJob } from '@/types/job';
import AramPlayerRepository from '@/repositories/AramPlayer.repository';

const schedule = new RecurrenceRule();
schedule.hour = process.env.ARAM_SCHEDULE_HOUR ?? 11;
schedule.minute = process.env.ARAM_SCHEDULE_MINUTE ?? 50;
schedule.tz = 'America/Sao_Paulo';

export default {
  schedule,
  async execute(client) {
    const { JOB_CHANNEL_ID } = process.env;

    if (!JOB_CHANNEL_ID) return;

    const channel = await client.channels.fetch(JOB_CHANNEL_ID);

    if (!channel) return;

    const files = [];

    if (process.env.ARAM_IMAGE_URL) {
      files.push(process.env.ARAM_IMAGE_URL);
    }

    const aramPlayers = await AramPlayerRepository.findAll();

    if (channel.isSendable()) {
      channel.send({
        content: aramPlayers.map((aramPlayer) => `<@${aramPlayer.id}>`).join(' '),
        files,
      });
    }
  },
} as IJob;
