import { ICommand } from '../command';
import UserRepository from '../repositories/User.repository';

export default {
  name: 'wins',
  async execute(client, msg, args) {
    const firstArg = args.shift();

    if (firstArg === 'rank') {
      const rank = await UserRepository.findWinnerRank();

      await msg.channel.send(
        '🏆 Ranking de Vitórias no Fortnite:\n\n'
        + `🥇 ${rank[0] ? `<@${rank[0].id}>` : '---'}\n`
        + `🥈 ${rank[1] ? `<@${rank[1].id}>` : '---'}\n`
        + `🥉 ${rank[2] ? `<@${rank[2].id}>` : '---'}\n`,
      );
    } else {
      const user = await UserRepository.findById(msg.author.id);
      await msg.reply(`Você tem ${user ? user.wins : 0} vitórias no Fortnite!`);
    }
  },
} as ICommand;
