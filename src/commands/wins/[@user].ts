import { ICommandFlag } from '@/types/command';
import UserRepository from '@/repositories/User.repository';
import FortniteAccountRepository from '@/repositories/FortniteAccount.repository';

const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

export default {
  name: '[@user]',
  description: 'Mostra vitórias no Fortnite do usuário mencionado',
  validator(args) {
    const firstArg = args.shift();
    return firstArg && /<@\d{18}>/.test(firstArg);
  },
  async execute(client, msg, args) {
    const firstArg = args.shift();
    if (!firstArg) return;

    const userId = firstArg.replace(/\D/g, '');
    let user = await UserRepository.findById(userId);

    if (!user?.epicUsername) {
      msg.reply(
        `:no_entry: <@${userId}> não setou a conta do Fornite!`,
      );
      return;
    }

    const lastWinsUpdateWasFiveMinutesAgo = (
      user?.winsUpdatedAt
      && Date.now() - new Date(user.winsUpdatedAt).getTime() > FIVE_MINUTES_IN_MS
    );

    if (lastWinsUpdateWasFiveMinutesAgo) {
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

    msg.reply(
      `<@${userId}> tem **${user ? user.wins : 0} ${user?.wins === 1 ? 'vitória' : 'vitórias'}** no Fortnite!`,
    );
  },
} as ICommandFlag;
