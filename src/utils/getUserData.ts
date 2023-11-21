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

    // Query to get the total number of followers
    const followers = await prisma.follow.count({
      where: {
        followerId: userProfile.id,
        status: true, // Assuming status true means a current following relationship
      },
    });

    return {
      ...userProfile,
      likeCount: userStats._sum.likeCount || 0,
      videosMade: userStats._count._all,
      followers, // Include the total followers in the return object
    };
  } catch (error) {
    throw error;
  }
}
