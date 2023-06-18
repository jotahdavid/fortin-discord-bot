import { ICommand } from '@/types/command';
import UserRepository from '@/repositories/User.repository';

export default {
  name: 'wins',
  description: 'Mostra quantidade atual de vitórias do usuário',
  async execute(client, msg) {
    const user = await UserRepository.findById(msg.author.id);
    await msg.reply(`Você tem ${user ? user.wins : 0} vitórias no Fortnite!`);
  },
} as ICommand;
