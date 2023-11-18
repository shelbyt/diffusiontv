// utils/getUserData.ts
import prisma from './prismaClient';

export async function getUserData(username: string) {
  try {
    const userProfile = await prisma.user.findUnique({
      where: { username },
      select: {
        username: true,
        id: true,
        imageUrl: true,

      },
    });

    const userStats = await prisma.image.aggregate({
      where: { username },
      _sum: { likeCount: true },
      _count: { _all: true },
    });

    if (!userProfile) {
      return null;
    }

    return {
      ...userProfile,
      likeCount: userStats._sum.likeCount || 0,
      videosMade: userStats._count._all,
    };
  } catch (error) {
    throw error;
  }
}
