import { ICommand } from '@/types/command';
import UserRepository from '@/repositories/User.repository';

export default {
  name: 'wins',
  description: 'Mostra quantidade atual de vitórias do usuário',
  async execute(client, msg) {
    const user = await UserRepository.findById(msg.author.id);
    if (user?.wins === 1) {
      await msg.reply(':trophy: Você tem **1 vitória** no Fortnite!');
      return;
    }
    await msg.reply(`:trophy: Você tem **${user ? user.wins : 0} vitórias** no Fortnite!`);
  },
} as ICommand;
