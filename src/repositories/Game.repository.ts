import { Game, PlayersOnGames } from '@prisma/client';

import prisma from '@/services/prisma';

interface GameWithPlayersOnGames extends Game {
  playersOnGames: PlayersOnGames[];
}

class GameRepository {
  findAll(limit?: number) {
    return prisma.game.findMany({
      take: limit,
    });
  }

  findById(gameId: number) {
    return prisma.game.findUnique({
      where: {
        id: gameId,
      },
    });
  }

  async searchByName<T extends boolean = false>(
    gameName: string,
    onlyFirst?: T,
  ): Promise<T extends true ? GameWithPlayersOnGames | null : GameWithPlayersOnGames[]> {
    const isOnlyFirst = onlyFirst ?? false;

    if (isOnlyFirst) {
      return await prisma.game.findFirst({
        where: {
          name: {
            contains: gameName,
            mode: 'insensitive',
          },
        },
        include: {
          playersOnGames: true,
        },
      }) as T extends true ? GameWithPlayersOnGames | null : GameWithPlayersOnGames[];
    }

    return await prisma.game.findMany({
      where: {
        name: {
          contains: gameName,
          mode: 'insensitive',
        },
      },
      include: {
        playersOnGames: true,
      },
    }) as T extends true ? GameWithPlayersOnGames | null : GameWithPlayersOnGames[];
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
