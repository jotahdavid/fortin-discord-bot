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
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from 'discord.js';
import Schedule from 'node-schedule';

import { ICommand, ICommandFlag } from '@/types/command';
import { IClient } from '@/types/client';
import { ISlashCommand } from './types/slashCommand';
import AramPlayerRepository from './repositories/AramPlayer.repository';

const {
  BOT_TOKEN,
  CHANNEL_ID,
  CLIENT_ID,
  ARAM_CHANNEL_ID,
  ARAM_SCHEDULE_HOUR,
  ARAM_SCHEDULE_MINUTE,
  BOT_PREFIX = '+',
} = process.env;

if (!BOT_TOKEN) {
  throw new Error('Insira a váriavel "BOT_TOKEN"!');
}

if (!CLIENT_ID) {
  throw new Error('Insira a váriavel "CLIENT_ID"!');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
}) as IClient<ICommand | ICommandFlag, ISlashCommand>;

client.commands = new Collection<string, ICommand>();
client.slashCommands = new Collection<string, ISlashCommand>();
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
      .replace(/\.{3}/g, '_spread_')
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

const isSpread = (value: string) => /\[_spread_(\w|@)+\]/.test(value);
const isWildcard = (value: string) => /\[(\w|@)+\]/.test(value);

function matchSlug(slug: string, commandSlug: string) {
  const slugItems = slug.split('.');
  const commandItems = commandSlug.split('.');

  if (slugItems.length !== commandItems.length && !slugItems.some(isSpread)) {
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

const slashCommandsPath = path.join(__dirname, 'slashCommands');
const slashCommandFiles = getAllFiles(slashCommandsPath)
  .filter((filePath) => filePath.endsWith('.js') || filePath.endsWith('.ts'))
  .map((filePath) => ({
    path: filePath,
    slug: filePath
      .replace(path.join(__dirname, 'slashCommands'), '')
      .replace(/^\/|^\\|\.js|\.ts|(\/?|\\?)index/g, '')
      .replace(/\.{3}/g, '_spread_')
      .replace(/\/|\\/g, '.'),
  }));

const isSlashCommand = (value: any): value is ISlashCommand => 'data' in value && 'execute' in value;

(async () => {
  const slashCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const file of slashCommandFiles) {
    // eslint-disable-next-line no-await-in-loop
    const slashCommand: unknown = (await import(file.path)).default;
    if (isSlashCommand(slashCommand)) {
      slashCommands.push(slashCommand.data.toJSON());
      client.slashCommands.set(file.slug, slashCommand);
    } else {
      console.log(`[AVISO] O comando no arquivo "${file.path}" está faltando a propriedade "name" ou "execute".`);
    }
  }

  const rest = new REST().setToken(BOT_TOKEN);

  try {
    console.log(`Started refreshing ${slashCommands.length} application (/) commands.`);

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: slashCommands },
    );

    console.log(`Successfully reloaded ${slashCommands.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  });
})();

const scheduleRule = new Schedule.RecurrenceRule();
scheduleRule.hour = ARAM_SCHEDULE_HOUR ?? 11;
scheduleRule.minute = ARAM_SCHEDULE_MINUTE ?? 50;
scheduleRule.tz = 'America/Sao_Paulo';

Schedule.scheduleJob(scheduleRule, async () => {
  if (!ARAM_CHANNEL_ID) return;

  const channel = await client.channels.fetch(ARAM_CHANNEL_ID);

  if (!channel) return;

  const files = [];

  if (process.env.ARAM_IMAGE_URL) {
    files.push(process.env.ARAM_IMAGE_URL);
  }

  const aramPlayers = await AramPlayerRepository.findAll();

  if ('send' in channel) {
    channel.send({
      content: aramPlayers.map((aramPlayer) => `<@${aramPlayer.id}>`).join(' '),
      files,
    });
  }
});

client.login(BOT_TOKEN);
