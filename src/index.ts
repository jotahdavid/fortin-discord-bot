import 'dotenv/config';

import {
  ChannelType, Client, Events, GatewayIntentBits,
} from 'discord.js';

const { BOT_TOKEN } = process.env;

if (!BOT_TOKEN) {
  throw new Error('Insira a váriavel "BOT_TOKEN"!');
}

const wins = new Map();

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

bot.once(Events.ClientReady, (client) => {
  console.log(`Logado como ${client.user.tag}`);
});

bot.on(Events.MessageCreate, async (msg) => {
  if (
    !msg.content.trim().startsWith('+')
    || msg.author.bot
    || msg.channel.type === ChannelType.DM
  ) {
    return;
  }

  const args = msg.content.trim().slice('+'.length).split(/ +/g);
  const command = args.shift()?.toLowerCase();

  if (!command) return;

  if (command === 'hello') {
    msg.channel.send({ content: 'Hello!' });
    return;
  }

  if (command === '1') {
    let userWins = wins.get(msg.author.id);
    if (!userWins) {
      wins.set(msg.author.id, 0);
      userWins = 0;
    }
    userWins += 1;
    wins.set(msg.author.id, userWins);
    msg.channel.send(`Nossa o ${msg.author} é muito bom, acabou de ganhar mais uma no Fortnite, já são ${userWins} vitórias!`);
  }
});

bot.login(BOT_TOKEN);
