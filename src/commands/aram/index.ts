import AramPlayerRepository from '@/repositories/AramPlayer.repository';
import { ICommand } from '@/types/command';

export default {
  name: 'aram',
  description: 'Envia foto do ARAM',
  aliases: ['flex'],
  async execute(client, msg) {
    const files = [];

    if (process.env.ARAM_IMAGE_URL) {
      files.push(process.env.ARAM_IMAGE_URL);
    }

    const aramPlayers = await AramPlayerRepository.findAll();

    msg.channel.send({
      content: aramPlayers.map((aramPlayer) => `<@${aramPlayer.id}>`).join(' '),
      files,
    });
  },
} as ICommand;
