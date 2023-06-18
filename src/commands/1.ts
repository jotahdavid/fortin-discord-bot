import { ICommand } from '@/types/command';
import UserRepository from '@/repositories/User.repository';

export default {
  name: '1',
  description: 'Acrescenta uma vitória ao contador de vitórias do usuário',
  async execute(client, msg) {
    const user = await UserRepository.findById(msg.author.id);
    if (!user) {
      await UserRepository.create({
        id: msg.author.id,
        wins: 1,
      });
    } else {
      await UserRepository.updateWins(msg.author.id, user.wins + 1);
    }

    const userWins = user ? user.wins + 1 : 1;

    if (userWins === 1) {
      msg.channel.send(`:trophy: ${msg.author} acaba de ganhar sua primeira partida no Fortnite!`);
      return;
    }

    msg.channel.send(`:trophy: ${msg.author} acaba de ganhar mais uma no Fortnite, já são **${userWins} vitórias!**`);
  },
} as ICommand;
