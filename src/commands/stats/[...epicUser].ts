import { ICommandFlag } from '@/types/command';
import FortniteAccountRepository from '@/repositories/FortniteAccount.repository';

export default {
  name: '[...epicUser]',
  description: 'Mostra estatísticas sobre a conta no Fornite',
  validator(args) {
    const firstArg = args.shift();
    return Boolean(firstArg);
  },
  async execute(client, msg, args) {
    const username = args.join(' ');
    if (!username) {
      msg.reply(':no_entry: Informe um nome de usuário!');
      return;
    }

    const fortniteAccount = await FortniteAccountRepository.findByUsername(username);

    if (!fortniteAccount) {
      msg.reply(':no_entry: Usuário não encontrado!');
      return;
    }

    msg.channel.send(
      `**📊 ESTATÍSTICAS DO USUÁRIO \`${fortniteAccount.account.name}\`**\n\n`
      + `:crown: VITÓRIAS: **${fortniteAccount.wins}**\n\n`
      + `:skull_crossbones: KILLS: **${fortniteAccount.kills}**\n\n`
      + `:video_game: TOTAL DE PARTIDAS: **${fortniteAccount.matches}**\n\n`
      + `:shopping_bags: NÍVEL PASSE DE BATALHA: **${fortniteAccount.battlePass.level}**`,
    );
  },
} as ICommandFlag;
