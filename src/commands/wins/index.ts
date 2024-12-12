import { ICommand } from '@/types/command';
import UserRepository from '@/repositories/User.repository';
import FortniteAccountRepository from '@/repositories/FortniteAccount.repository';

const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

export default {
  name: 'wins',
  description: 'Mostra quantidade atual de vitórias do usuário',
  async execute(client, msg) {
    let user = await UserRepository.findById(msg.author.id);

    if (
      user?.winsUpdatedAt && user.epicUsername
      && Date.now() - new Date(user.winsUpdatedAt).getTime() > FIVE_MINUTES_IN_MS
    ) {
      const fortniteAccount = await FortniteAccountRepository.findByUsername(user.epicUsername);

      if (!fortniteAccount) {
        msg.reply(`:no_entry: Não foi possível encontrar a conta: ${user.epicUsername}`);
        return;
      }

      if ('error' in fortniteAccount) {
        if (fortniteAccount.code === 'USER_NO_HISTORY') {
          msg.reply(`:no_entry: O player ${user.epicUsername} não jogou nenhuma partida na última season!`);
          return;
        }
        msg.reply(':no_entry: Algum erro inesperado aconteceu!');
        return;
      }

      user = await UserRepository.updateWins(user.id, fortniteAccount.wins);
    }

    if (user?.wins === 1) {
      await msg.reply(':trophy: Você tem atualmente **1 vitória** na season atual do Fortnite!');
      return;
    }
    await msg.reply(`:trophy: Você tem **${user ? user.wins : 0} vitórias** na season atual do Fortnite!`);
  },
} as ICommand;
