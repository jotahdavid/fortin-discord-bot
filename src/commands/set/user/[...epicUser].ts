import { ICommandFlag } from '@/types/command';
import FortniteAccountRepository from '@/repositories/FortniteAccount.repository';
import UserRepository from '@/repositories/User.repository';

export default {
  name: '[...epicUser]',
  description: 'Mostra estatísticas sobre a conta no Fornite',
  validator(args) {
    const secondArg = args[1];
    return Boolean(secondArg);
  },
  async execute(client, msg, args) {
    const [, ...usernameParts] = args;
    const username = usernameParts.join(' ');
    if (!username) {
      msg.reply(':no_entry: Informe um nome de conta Epic Games!');
      return;
    }

    const user = await UserRepository.findById(msg.author.id);

    if (user && username.toLowerCase() === user.epicUsername?.toLowerCase()) {
      msg.reply(':no_entry: Essa conta já está atrelada ao seu usuário!');
      return;
    }

    const fortniteAccount = await FortniteAccountRepository.findByUsername(username);

    if (!fortniteAccount) {
      msg.reply(`:no_entry: Não encontrei nenhuma conta com nome: ${username}!`);
      return;
    }

    if ('error' in fortniteAccount) {
      if (fortniteAccount.code === 'USER_NO_HISTORY') {
        msg.reply(`:no_entry: O player ${username} não jogou nenhuma partida na última season!`);
        return;
      }
      msg.reply(':no_entry: Algum erro inesperado aconteceu!');
      return;
    }

    try {
      if (!user) {
        await UserRepository.create({
          id: msg.author.id,
          wins: fortniteAccount.wins,
          epicUsername: fortniteAccount.account.name,
          winsUpdatedAt: new Date(),
        });

        msg.reply(
          `:white_check_mark: Conta **${fortniteAccount.account.name}** adicionada com sucesso!`,
        );
        return;
      }

      await UserRepository.update(msg.author.id, {
        wins: fortniteAccount.wins,
        epicUsername: fortniteAccount.account.name,
        winsUpdatedAt: new Date(),
      });
      msg.reply(
        `:white_check_mark: Conta alterada com sucesso para **${fortniteAccount.account.name}**!`,
      );
    } catch (err) {
      msg.reply(':no_entry: Não foi possível definir o nome de usuário do Fornite!');
    }
  },
} as ICommandFlag;
