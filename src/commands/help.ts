import { EmbedBuilder } from 'discord.js';

import { ICommand } from '@/types/command';

export default {
  name: 'help',
  description: 'Mostra todos os comandos disponíveis',
  async execute(client, msg) {
    const slashCommands = client.slashCommands
      .map((command) => ({
        name: `\`/${command.data.name}\``,
        value: command.data.description,
      }));

    const commands = client.commands
      .map((command, slug) => ({
        name: `\`${client.prefix}${slug.replace(/\./g, ' ').replace(/_spread_/g, '')}\``,
        value: command.description,
      }));

    const commandFields = [...slashCommands, ...commands]
      .sort((commandA, commandB) => {
        if (commandA.name < commandB.name) return -1;
        if (commandA.name > commandB.name) return 1;
        return 0;
      });

    const embed = new EmbedBuilder()
      .setColor(msg.member?.displayHexColor ?? null)
      .setTitle('🤖 Comandos disponíveis')
      .setThumbnail(client.user?.avatarURL() ?? null)
      .addFields(commandFields)
      .setTimestamp();

    msg.channel.send({ embeds: [embed] });
  },
} as ICommand;
