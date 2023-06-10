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
          + `🥇 ${
            rank[0]
              ? `<@${rank[0].id}> é o melhor! Elu já tem ${rank[0].wins} vitórias!!!`
              : '---'
          }\n`
          + `🥈 ${
            rank[1]
              ? `<@${rank[1].id}> é bem bom, viu! Ele tem ${rank[1].wins} vitórias`
              : '---'
          }\n`
          + `🥉 ${
            rank[2]
              ? `<@${rank[2].id}> é um jogador notável. Conta com ${rank[2].wins} vitórias`
              : '---'
          }\n`,
      );
    } else {
      const user = await UserRepository.findById(msg.author.id);
      await msg.reply(`Você tem ${user ? user.wins : 0} vitórias no Fortnite!`);
    }
  },
} as ICommand;
