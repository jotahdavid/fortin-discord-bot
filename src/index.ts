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

import { ICommand, ICommandFlag } from '@/types/command';
import { IClient } from '@/types/client';

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
}) as IClient<ICommand | ICommandFlag>;

client.commands = new Collection<string, ICommand>();
client.prefix = BOT_PREFIX;

function getAllFiles(dirPath: string, arrayOfFiles: string[] | null = null) {
  const files = fs.readdirSync(dirPath);

  let result = arrayOfFiles ? [...arrayOfFiles] : [];

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      result = getAllFiles(path.join(dirPath, file), result);
    } else {
      result.push(path.join(dirPath, file));
    }
  });

  return result;
}

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = getAllFiles(commandsPath)
  .filter((filePath) => filePath.endsWith('.js') || filePath.endsWith('.ts'))
  .map((filePath) => ({
    path: filePath,
    slug: filePath
      .replace(path.join(__dirname, 'commands'), '')
      .replace(/^\/|^\\|\.js|\.ts|(\/?|\\?)index/g, '')
      .replace(/\/|\\/g, '.'),
  }));

const isCommand = (value: any): value is ICommand => 'name' in value && 'execute' in value;

commandFiles.forEach(async (file) => {
  const command: unknown = (await import(file.path)).default;
  if (isCommand(command)) {
    client.commands.set(file.slug, command);
  } else {
    console.log(`[AVISO] O comando no arquivo "${file.path}" está faltando a propriedade "name" ou "execute".`);
  }
});

client.once(Events.ClientReady, (c) => {
  console.log(`Logado como ${c.user.tag}`);
  c.user.setActivity('Fortnite', { type: ActivityType.Playing });
});

const isWildcard = (value: string) => /\[(\w|@)+\]/.test(value);

function matchSlug(slug: string, commandSlug: string) {
  const slugItems = slug.split('.');
  const commandItems = commandSlug.split('.');

  if (slugItems.length !== commandItems.length) {
    return false;
  }

  for (let i = 0; i < slugItems.length; i += 1) {
    if (!isWildcard(slugItems[i]) && slugItems[i] !== commandItems[i]) {
      return false;
    }
  }

  return true;
}

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

  if (args.length === 0) {
    const command = client.commands.get(commandName);

    if (!command) {
      await msg.reply(`Comando não encontrado, utilize \`${client.prefix}help\``);
      return;
    }

    command.execute(client, msg, args);
    return;
  }

  const slug = `${commandName}.${args.join('.')}`;
  const command = client.commands.get(slug);

  if (command) {
    command.execute(client, msg, args);
    return;
  }

  const commands = client.commands.filter((cmd, key) => 'validator' in cmd && matchSlug(key, slug)) as Collection<string, ICommandFlag>;
  const comandWildcard = commands.find((commandFlag) => commandFlag.validator([...args]));

  if (comandWildcard) {
    comandWildcard.execute(client, msg, args);
    return;
  }

  await msg.reply(`Comando não encontrado, utilize \`${client.prefix}help\``);
});

client.login(BOT_TOKEN);
