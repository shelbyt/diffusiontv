import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getPrivateUserData(sl_id: string) {
  try {
    const userProfile = await prisma.user.findUnique({
      where: { sl_id: sl_id },
      select: {
        username: true,
        id: true,
        imageUrl: true,
      },
    });
    if (!userProfile || userProfile.username === null) {
      throw new Error('User not found or username is null');
    }

    const userStats = await prisma.image.aggregate({
      where: { username: userProfile.username },
      _sum: { likeCount: true },
      _count: { _all: true },
    });

    if (!userStats) {
      throw new Error('User statistics not found');
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
