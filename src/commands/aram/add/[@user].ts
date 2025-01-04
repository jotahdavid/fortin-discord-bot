import AramPlayerRepository from '@/repositories/AramPlayer.repository';
import { ICommandFlag } from '@/types/command';

export default {
  name: '[@user]',
  description: 'Adiciona usuário a lista de players do ARAM',
  validator(args) {
    const [, secondArg] = args;

    return secondArg && /<@\d{18}>/.test(secondArg);
  },
  async execute(client, msg, args) {
    const [, secondArg] = args;
    if (!secondArg) return;

    const userId = secondArg.replace(/\D/g, '');
    const aramPlayer = await AramPlayerRepository.findById(userId);

    if (aramPlayer) {
      msg.reply(
        `:no_entry: <@${userId}> já está na lista do ARAM!`,
      );
      return;
    }

    const discordUser = await client.users.fetch(userId);

    if (!discordUser) {
      msg.reply(
        ':no_entry: Não foi possível encontrar o usuário mencionado',
      );
      return;
    }

    await AramPlayerRepository.create({
      id: userId,
      name: discordUser.displayName,
    });

    msg.reply(
      `:white_check_mark: Adicionado <@${discordUser.id}> na lista do ARAM!`,
    );
  },
} as ICommandFlag;
