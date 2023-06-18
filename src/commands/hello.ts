import { ICommand } from '@/types/command';

export default {
  name: 'hello',
  description: 'Diz Olá!',
  async execute(client, msg) {
    msg.reply('Olá!');
  },
} as ICommand;
