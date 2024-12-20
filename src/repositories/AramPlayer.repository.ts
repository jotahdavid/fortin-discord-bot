import prisma from '@/services/prisma';

class AramPlayerRepository {
  findAll() {
    return prisma.aramPlayer.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}

export default new AramPlayerRepository();
