import { ICommand } from '../command';

const command: ICommand = {
  name: 'hello',
  async execute(client, msg) {
    msg.reply('Olá!');
  },
};

export default command;
