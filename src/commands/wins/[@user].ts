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

    if (
      user.winsUpdatedAt
      && Date.now() - new Date(user.winsUpdatedAt).getTime() > FIVE_MINUTES_IN_MS
    ) {
      const fortniteAccount = await FortniteAccountRepository.findByUsername(user.epicUsername);

      if (!fortniteAccount) {
        msg.reply(`:no_entry: Não foi possível encontrar a conta: ${user.epicUsername}`);
        return;
      }

      user = await UserRepository.updateWins(user.id, fortniteAccount.wins);
    }

    msg.reply(
      `<@${userId}> tem **${user ? user.wins : 0} ${user?.wins === 1 ? 'vitória' : 'vitórias'}** no Fortnite!`,
    );
  },
} as ICommandFlag;
