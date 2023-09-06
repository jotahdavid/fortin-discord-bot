import FortniteAccountRepository from '@/repositories/FortniteAccount.repository';
import UserRepository from '@/repositories/User.repository';
import { ICommand } from '@/types/command';

const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

let lastTimeCommandTrigger = new Date(0);

export default {
  name: 'rank',
  description: 'Mostra rank de vitórias',
  async execute(client, msg) {
    if (Date.now() - lastTimeCommandTrigger.getTime() > FIVE_MINUTES_IN_MS) {
      const users = await UserRepository.findAll();
      const filteredUsers = users.filter((user) => (
        user.epicUsername && user.winsUpdatedAt
        && Date.now() - new Date(user.winsUpdatedAt).getTime() > FIVE_MINUTES_IN_MS
      ));
      const fortniteAccountPromises = filteredUsers.map((user) => (
        FortniteAccountRepository.findByUsername(user.epicUsername!)
      ));
      const fortniteAccounts = await Promise.all(fortniteAccountPromises);
      const updatedUsers = fortniteAccounts.reduce(
        (acc, account, index) => (
          account && 'wins' in account ? acc.concat({ id: users[index].id, wins: account.wins }) : acc
        ),
        [] as Array<{ id: string; wins: number; }>,
      );
      await UserRepository.updateManyWins(updatedUsers);
    }

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

    lastTimeCommandTrigger = new Date();
  },
} as ICommand;
