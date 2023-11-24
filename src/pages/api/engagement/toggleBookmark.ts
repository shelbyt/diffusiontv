// import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prismaClient'

// const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    try {
      const { userId, imageId } = req.body;

      if (!userId || !imageId) {
        return res.status(400).json({ error: 'userId and imageId are required' });
      }

      // Fetch the current bookmark state
      const existingBookmark = await prisma.userBookmarks.findUnique({
        where: {
          userId_imageId_bookmark: {
            userId: userId,
            imageId: imageId,
          },
        },
      });

      const isBookmarked = existingBookmark ? !existingBookmark.bookmarked : true;
      const currentTime = new Date(); // Get the current date and time

      // Update or create the bookmark record
      const bookmark = await prisma.userBookmarks.upsert({
        where: {
          userId_imageId_bookmark: {
            userId: userId,
            imageId: imageId,
          },
        },
        update: {
          bookmarked: isBookmarked,
          updatedAt: currentTime, // Update the updatedAt field
        },
        create: {
          userId: userId,
          imageId: imageId,
          bookmarked: isBookmarked,
        },
      });

      return res.status(200).json({ isBookmarked: bookmark.bookmarked });
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
