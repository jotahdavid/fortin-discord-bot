import path from 'path';
import fs from 'fs';

import 'dotenv/config';
import {
  ActivityType,
  ChannelType,
  Client,
  Collection,
  Events,
  GatewayIntentBits,
} from 'discord.js';

import { ICommand } from './types/command';
import { IClient } from './types/client';

const { BOT_TOKEN, CHANNEL_ID, BOT_PREFIX = '+' } = process.env;

if (!BOT_TOKEN) {
  throw new Error('Insira a váriavel "BOT_TOKEN"!');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
}) as IClient<ICommand>;

client.commands = new Collection<string, ICommand>();
client.prefix = BOT_PREFIX;

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js') || file.endsWith('.ts'));

const isCommand = (value: any): value is ICommand => 'name' in value && 'execute' in value;

commandFiles.forEach(async (file) => {
  const filePath = path.join(commandsPath, file);
  const command: unknown = (await import(filePath)).default;
  if (isCommand(command)) {
    client.commands.set(command.name, command);
  } else {
    console.log(`[AVISO] O comando no arquivo "${filePath}" está faltando a propriedade "name" ou "execute".`);
  }
});

client.once(Events.ClientReady, (c) => {
  console.log(`Logado como ${c.user.tag}`);
  c.user.setActivity('Fortnite', { type: ActivityType.Playing });
});

client.on(Events.MessageCreate, async (msg) => {
  if (
    !msg.content.trim().startsWith(client.prefix)
    || msg.author.bot
    || msg.channel.type === ChannelType.DM
  ) {
    return;
  }

  const args = msg.content.trim().slice(client.prefix.length).split(/ +/g);
  const commandName = args.shift()?.toLowerCase();

  if (!commandName || (CHANNEL_ID && msg.channelId !== CHANNEL_ID)) return;

  const command = client.commands.get(commandName);

  if (!command) {
    await msg.reply(`Comando não encontrado, utilize \`${client.prefix}help\``);
    return;
  }

  console.log(`Comando ${client.prefix}${commandName} executado!`);
  command.execute(client, msg, args);
});

client.login(BOT_TOKEN);
