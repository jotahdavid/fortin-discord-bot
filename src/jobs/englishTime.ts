import { RecurrenceRule } from 'node-schedule';

import { IJob } from '@/types/job';

const schedule = new RecurrenceRule();
schedule.hour = process.env.ENGLISH_TIME_SCHEDULE_HOUR ?? 17;
schedule.minute = process.env.ENGLISH_TIME_SCHEDULE_MINUTE ?? 45;
schedule.tz = 'America/Sao_Paulo';

export default {
  schedule,
  async execute(client) {
    const { JOB_CHANNEL_ID, ENGLISH_VOICE_CHANNEL_ID } = process.env;

    if (!JOB_CHANNEL_ID || !ENGLISH_VOICE_CHANNEL_ID) return;

    const voiceChannel = await client.channels
      .fetch(ENGLISH_VOICE_CHANNEL_ID, { cache: false, force: true });
    const channel = await client.channels.fetch(JOB_CHANNEL_ID);

    if (!voiceChannel || !channel) return;

    const FIVETEEN_MINUTES_IN_MS = 1000 * 60 * 15;

    if (voiceChannel.isVoiceBased() && channel.isSendable() && voiceChannel.members.size > 0) {
      const members = voiceChannel.members.map((member) => `<@${member.id}>`);

      channel.send(`🗣️ Only English Time! ${members.join(' ')}`);

      setTimeout(() => {
        channel.send(`🛑 O tempo do Inglês acabou! ${members.join(' ')}`);
      }, FIVETEEN_MINUTES_IN_MS);
    }
  },
} as IJob;
