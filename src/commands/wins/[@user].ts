import UserRepository from '../../repositories/User.repository';
import { ICommandFlag } from '../../types/command';

export default {
  name: '[@user]',
  description: 'Mostra vitórias de usuário mencionado',
  validator(args) {
    const firstArg = args.shift();
    return firstArg && /<@\d{18}>/.test(firstArg);
  },
  async execute(client, msg, args) {
    const firstArg = args.shift();
    if (!firstArg) return;
    const userId = firstArg.replace(/\D/g, '');
    const user = await UserRepository.findById(userId);
    await msg.reply(`<@${userId}> tem ${user ? user.wins : 0} vitórias no Fortnite!`);
  },
} as ICommandFlag;
