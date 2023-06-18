import { User } from '@prisma/client';

import prisma from '@/services/prisma';

class UserRepository {
  findById(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  create(newUser: User) {
    return prisma.user.create({
      data: newUser,
    });
  }

  updateWins(userId: string, wins: number) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        wins,
      },
    });
  }

  findWinnerRank() {
    return prisma.user.findMany({
      take: 3,
      orderBy: {
        wins: 'desc',
      },
      where: {
        wins: {
          gt: 0,
        },
      },
    });
  }
}

export default new UserRepository();
