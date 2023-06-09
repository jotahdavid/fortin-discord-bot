import { ICommand } from '../command';

const wins = new Map<string, number>();

export default {
  name: '1',
  async execute(client, msg) {
    let userWins = wins.get(msg.author.id);
    if (!userWins) {
      wins.set(msg.author.id, 0);
      userWins = 0;
    }
    userWins += 1;
    wins.set(msg.author.id, userWins);
    msg.channel.send(`Nossa o ${msg.author} é muito bom, acabou de ganhar mais uma no Fortnite, já são ${userWins} vitórias!`);
  },
} as ICommand;
