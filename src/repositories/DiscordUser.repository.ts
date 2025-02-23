import { DiscordUser, PlayersOnGames } from '@prisma/client';

import prisma from '@/services/prisma';

class DiscordUserRepository {
  findAll() {
    return prisma.discordUser.findMany();
  }

  findById(discordUserId: string) {
    return prisma.discordUser.findUnique({
      where: {
        id: discordUserId,
      },
      include: {
        playersOnGames: true,
      },
    });
  }

  firstOrCreate(discordUserId: string) {
    return prisma.discordUser.upsert({
      where: {
        id: discordUserId,
      },
      update: {},
      create: {
        id: discordUserId,
      },
      include: {
        playersOnGames: true,
      },
    });
  }

  create(newDiscordUser: Omit<DiscordUser, 'createdAt' | 'updatedAt'> & { onGames?: number[] }) {
    const { onGames = [] } = newDiscordUser;

    return prisma.discordUser.create({
      data: {
        ...newDiscordUser,
        playersOnGames: {
          createMany: {
            data: onGames.map((gameId) => ({ gameId })),
          },
        },
      },
    });
  }

  update(discordUserId: string, updatedDiscordUser: Omit<DiscordUser, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.discordUser.update({
      where: {
        id: discordUserId,
      },
      data: updatedDiscordUser,
    });
  }

  addGame(discordUserId: string, gameId: number) {
    return prisma.discordUser.update({
      where: {
        id: discordUserId,
      },
      data: {
        playersOnGames: {
          upsert: {
            where: {
              gameId_discordUserId: {
                discordUserId,
                gameId,
              },
            },
            create: {
              gameId,
            },
            update: {},
          },
        },
      },
    });
  }
}

export default new DiscordUserRepository();
