import AramPlayerRepository from '@/repositories/AramPlayer.repository';
import { ICommandFlag } from '@/types/command';

export default {
  name: '[@user]',
  description: 'Remove usuário da lista de players do ARAM',
  validator(args) {
    const [, secondArg] = args;
    return secondArg && /<@\d{18}>/.test(secondArg);
  },
  async execute(client, msg, args) {
    const [, secondArg] = args;
    if (!secondArg) return;

    const userId = secondArg.replace(/\D/g, '');
    const aramPlayer = await AramPlayerRepository.findById(userId);

    if (!aramPlayer) {
      msg.reply(
        `:no_entry: <@${userId}> não está na lista do ARAM!`,
      );
      return;
    }

    await AramPlayerRepository.deleteById(userId);

    msg.reply(
      `:white_check_mark: Removido <@${userId}> na lista do ARAM!`,
    );
  },
} as ICommandFlag;
