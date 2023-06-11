import { EmbedBuilder } from 'discord.js';
import { ICommand } from '../types/command';

export default {
  name: 'help',
  description: 'Mostra todos os comandos disponíveis',
  async execute(client, msg) {
    const commandFields = client.commands.map((command) => ({
      name: `\`${client.prefix}${command.name}\``,
      value: command.description,
    }));

    const embed = new EmbedBuilder()
      .setColor(msg.member?.displayHexColor ?? null)
      .setTitle('🤖 Comandos disponíveis')
      .setThumbnail(client.user?.avatarURL() ?? null)
      .addFields(commandFields)
      .setTimestamp();

    msg.channel.send({ embeds: [embed] });
  },
} as ICommand;
