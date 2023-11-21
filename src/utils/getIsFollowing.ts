// utils/getIsFollowing.ts
import prisma from './prismaClient'; // Adjust the import path as needed

async function getIsFollowing(followerId: string, followingId: string): Promise<boolean> {
	try {
		const followStatus = await prisma.follow.findUnique({
			where: {
				followerId_followingId: {
					followerId,
					followingId,
				},
			},
			select: {
				status: true,
			},
		});
		return !!followStatus?.status;
	} catch (error) {
		console.error('Error in getIsFollowing:', error);
		throw error; // Or handle it as you see fit
	}
}

export default getIsFollowing;
