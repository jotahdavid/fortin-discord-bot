import { ICommand } from '../types/command';
import UserRepository from '../repositories/User.repository';

export default {
  name: 'lose',
  description: 'Diminui uma vitória ao contador de vitórias do usuário',
  async execute(client, msg) {
    const user = await UserRepository.findById(msg.author.id);
    if (!user) {
      await UserRepository.create({
        id: msg.author.id,
        wins: 0,
      });
    } else if (user.wins > 0) {
      await UserRepository.updateWins(msg.author.id, user.wins - 1);
    }

    const userWins = user && user.wins > 0 ? user.wins - 1 : 0;

    msg.channel.send(`${msg.author} acaba de perder uma vitória no Fortnite, restando ${userWins} vitórias!`);
  },
} as ICommand;
