import prisma from '@/services/prisma';

class AramPlayerRepository {
  findAll() {
    return prisma.aramPlayer.findMany({
      orderBy: {
        order: 'asc',
      },
    });
  }
}

export default new AramPlayerRepository();
