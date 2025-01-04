import { AramPlayer } from '@prisma/client';
import prisma from '@/services/prisma';

class AramPlayerRepository {
  findAll() {
    return prisma.aramPlayer.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  findById(aramPlayerId: string) {
    return prisma.aramPlayer.findUnique({
      where: {
        id: aramPlayerId,
      },
    });
  }

  create(newAramPlayer: AramPlayer) {
    return prisma.aramPlayer.create({
      data: newAramPlayer,
    });
  }
}

export default new AramPlayerRepository();
