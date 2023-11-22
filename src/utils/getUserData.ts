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

    if (!userProfile) {
      return null;
    }

    // const userStats = await prisma.image.aggregate({
    //   where: { username },
    //   _sum: { likeCount: true },
    //   _count: { _all: true },
    // });

    const userStats = await prisma.image.aggregate({
      where: { username },
      _sum: {
        likeCount: true,
        heartCount: true, // Assuming heartCount is the field you want to sum
      },
      _count: { _all: true },
    });

    if (!userStats) {
      return null;
    }

    const userLikes = await prisma.userEngagement.aggregate({
      where: {
        userId: userProfile?.id,
        liked: true
      },
      _count: { _all: true },
    });

    if (!userLikes) {
      return null;
    }

    // Query to get the total number of followers
    const followers = await prisma.follow.count({
      where: {
        followingId: userProfile.id,
        status: true, // Assuming status true means a current following relationship
      },
    });

    return {
      ...userProfile,
      totalLikeHeartEngageCount: (userStats._sum.likeCount || 0) + (userStats._sum.heartCount || 0) + userLikes._count._all,
      videosMade: userStats._count._all,
      followers, // Include the total followers in the return object
    };
  } catch (error) {
    throw error;
  }
}
