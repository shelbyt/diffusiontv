import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prismaClient';

// Define a type for the request body
type FollowRequestBody = {
  followerId: string;
  followingId: string;
};
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { followerId, followingId } = req.body as FollowRequestBody;

  try {
    // Check if the follow relationship already exists
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    // Toggle the follow status if the relationship exists
    if (existingFollow) {
      const updatedFollow = await prisma.follow.update({
        where: {
          id: existingFollow.id,
        },
        data: {
          status: !existingFollow.status,
        },
      });

      return res.status(200).json({ isFollowing: updatedFollow.status });
    } 

    // If no existing relationship, create a new follow record
    else {
      const newFollow = await prisma.follow.create({
        data: {
          followerId,
          followingId,
          status: true, // Assuming default status is true for a new follow
        },
      });

      return res.status(200).json({ isFollowing: newFollow.status, isFirstTimeFollow: true });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error processing follow/unfollow' });
  }
}
