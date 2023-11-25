import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prismaClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    try {
      const { userId, imageId } = req.body;


      if (!userId || !imageId) {
        return res.status(400).json({ error: 'userId and imageId are required' });
      }

      // Fetch the current bookmark state
      const existingLike = await prisma.userEngagement.findUnique({
        where: {
          userId_imageId: {
            userId: userId,
            imageId: imageId,
          },
        },
      });

      const isLiked = existingLike ? !existingLike.liked : true;
      const currentTime = new Date(); // Get the current date and time

      // Update or create the bookmark record
      const like = await prisma.userEngagement.upsert({
        where: {
          userId_imageId: {
            userId: userId,
            imageId: imageId,
          },
        },
        update: {
          liked: isLiked,
          updatedAt: currentTime, // Update the updatedAt field
        },
        create: {
          userId: userId,
          imageId: imageId,
          liked: isLiked,
        },
      });


      return res.status(200).json({ isLiked: like.liked });
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
