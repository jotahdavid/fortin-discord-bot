import { EmbedBuilder } from 'discord.js';

import { ICommand } from '@/types/command';
import FortniteAccountRepository from '@/repositories/FortniteAccount.repository';
import UserRepository from '@/repositories/User.repository';

export default {
  name: 'stats',
  description: 'Mostra estatísticas sobre a conta no Fornite do usuário',
  async execute(client, msg) {
    const user = await UserRepository.findById(msg.author.id);

    if (!user?.epicUsername) {
      msg.reply(`:no_entry: Você não tem uma conta do Fortnite atrelada! Use o comando \`${client.prefix}set user [epicUser]\``);
      return;
    }

    const fortniteAccount = await FortniteAccountRepository.findByUsername(user.epicUsername);

    if (!fortniteAccount) {
      msg.reply(`:no_entry: A conta "${user.epicUsername}" não foi encontrada!`);
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

    const hoursPlayed = Math.floor(fortniteAccount.minutesPlayed / 60);
    const minutesPlayed = Math.floor((fortniteAccount.minutesPlayed / 60 - hoursPlayed) * 60);

    const timePlayed = minutesPlayed > 0
      ? `${hoursPlayed}h${String(minutesPlayed).padStart(2, '0')}m`
      : `${hoursPlayed}h`;

    const embed = new EmbedBuilder()
      .setAuthor({ name: `Player: ${fortniteAccount.account.name}` })
      .setTitle('📊 ESTATÍSTICAS DA SEASON ATUAL')
      .addFields([
        { name: '\u200B', value: `:video_game: TOTAL DE PARTIDAS: **${fortniteAccount.matches}**` },
        { name: '\u200B', value: `:crown: VITÓRIAS: **${fortniteAccount.wins}**` },
        { name: '\u200B', value: `:chart_with_upwards_trend: WINRATE: **${fortniteAccount.winRate}%**` },
        { name: '\u200B', value: `:skull_crossbones: KILLS: **${fortniteAccount.kills}**` },
        { name: '\u200B', value: `:shopping_bags: NÍVEL PASSE DE BATALHA: **${fortniteAccount.battlePass.level}**` },
        { name: '\u200B', value: `:stopwatch: TEMPO DE JOGO: **${timePlayed}**` },
      ])
      .setTimestamp();

    msg.channel.send({ embeds: [embed] });
  },
} as ICommand;
