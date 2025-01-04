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

  deleteById(aramPlayerId: string) {
    return prisma.aramPlayer.delete({
      where: {
        id: aramPlayerId,
      },
    });
  }
}

export default new AramPlayerRepository();
