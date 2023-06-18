import UserRepository from '@/repositories/User.repository';
import { ICommand } from '@/types/command';

export default {
  name: 'rank',
  description: 'Mostra rank de vitórias',
  async execute(client, msg) {
    const rank = await UserRepository.findWinnerRank();
    const formattedDate = new Intl.DateTimeFormat('pt-BR').format(new Date());

    await msg.channel.send(
      `***🏆 RANKING DE VITÓRIAS NO FORTNITE (${formattedDate}):***\n\n`
      + `🥇 ${
        rank[0]
          ? `<@${rank[0].id}> é o(a) melhor! Ele(a) já tem **\`${rank[0].wins} vitórias\`**`
          : '---'
      }\n\n`
        + `🥈 ${
          rank[1]
            ? `<@${rank[1].id}> é bem bom, viu! Ele(a) tem **\`${rank[1].wins} vitórias\`**`
            : '---'
        }\n\n`
        + `🥉 ${
          rank[2]
            ? `<@${rank[2].id}> é um(a) jogador(a) notável. Conta com **\`${rank[2].wins} vitórias\`**`
            : '---'
        }`,
    );
  },
} as ICommand;
