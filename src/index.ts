import path from 'path';
import fs from 'fs';

import 'dotenv/config';
import {
  ChannelType,
  Client,
  Collection,
  Events,
  GatewayIntentBits,
} from 'discord.js';
import { ICommand } from './command';

const { BOT_TOKEN } = process.env;

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
}) as Client & { commands: Collection<string, ICommand> };

client.commands = new Collection<string, ICommand>();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js') || file.endsWith('.ts'));

commandFiles.forEach(async (file) => {
  const filePath = path.join(commandsPath, file);
  const command = (await import(filePath)).default as ICommand;
  if ('name' in command && 'execute' in command) {
    client.commands.set(command.name, command);
  } else {
    console.log(`[AVISO] O comando no arquivo "${filePath}" está faltando a propriedade "name" ou "execute".`);
  }
});

client.once(Events.ClientReady, (c) => {
  console.log(`Logado como ${c.user.tag}`);
});

client.on(Events.MessageCreate, async (msg) => {
  if (
    !msg.content.trim().startsWith('+')
    || msg.author.bot
    || msg.channel.type === ChannelType.DM
  ) {
    return;
  }

  const args = msg.content.trim().slice('+'.length).split(/ +/g);
  const commandName = args.shift()?.toLowerCase();

  if (!commandName) return;

  const command = client.commands.get(commandName);

  if (command) {
    console.log(`Comando +${commandName} executado!`);
    command.execute(client, msg, args);
  }
});

client.login(BOT_TOKEN);
