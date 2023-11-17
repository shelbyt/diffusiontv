import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("in toggle")
  if (req.method === 'PATCH') {
    try {
      const { userId, imageId, liked = undefined, bookmarked = undefined } = req.body;


      let updateData: { liked?: boolean; bookmarked?: boolean } = {};
      if (liked !== undefined) {
        updateData.liked = liked;
      }
      if (bookmarked !== undefined) {
        updateData.bookmarked = bookmarked;
      }

      // Check if there's at least one field to update
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No valid fields provided for update' });
      }

      const engagement = await prisma.userEngagement.upsert({
        where: {
          userId_imageId: {
            userId: userId,
            imageId: imageId,
          },
        },
        update: updateData,
        create: {
          userId: userId,
          imageId: imageId,
          ...updateData,
        },
      });

     console.log("success insert = ", engagement)
      return res.status(200).json(engagement);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
