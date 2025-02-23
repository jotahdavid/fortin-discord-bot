import { Game } from '@prisma/client';

import prisma from '@/services/prisma';

class GameRepository {
  findAll() {
    return prisma.game.findMany();
  }

  findById(gameId: number) {
    return prisma.game.findUnique({
      where: {
        id: gameId,
      },
    });
  }

  searchByName(gameName: string) {
    return prisma.game.findFirst({
      where: {
        name: {
          contains: gameName,
          mode: 'insensitive',
        },
      },
      include: {
        playersOnGames: true,
      },
    });
  }

  create(newGame: Omit<Game, 'id' | 'createdAt' | 'updatedAt'> & { discordUsers?: string[] }) {
    const { discordUsers = [] } = newGame;

    return prisma.game.create({
      data: {
        ...newGame,
        playersOnGames: {
          createMany: {
            data: discordUsers.map((discordUserId) => ({ discordUserId })),
          },
        },
      },
    });
  }
}

export default new GameRepository();
