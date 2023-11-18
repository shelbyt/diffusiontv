// utils/getUserData.ts
import prisma from './prismaClient';

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

    if (!userProfile) {
      return null;
    }
    console.log("In private username =", userProfile.username)


    const userStats = await prisma.image.aggregate({
      where: { username: userProfile.username },
      _sum: { likeCount: true },
      _count: { _all: true },
    });

    if (!userStats) {
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
