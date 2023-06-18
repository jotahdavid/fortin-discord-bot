import UserRepository from '../../repositories/User.repository';
import { ICommand } from '../../types/command';

export default {
  name: 'rank',
  description: 'Mostra rank de vitórias',
  async execute(client, msg) {
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
  },
} as ICommand;
