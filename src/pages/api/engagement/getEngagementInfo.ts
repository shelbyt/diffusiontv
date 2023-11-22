// pages/api/get-engagement.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { userId, imageId } = req.query;

			if(!userId || !imageId) {
				return res.status(400).json({ error: 'userId and imageId are required' });
			}


            // Query for like status
            const likeStatus = await prisma.userEngagement.findUnique({
                where: {
                    userId_imageId: {
                        userId: userId as string,
                        imageId: imageId as string,
                    },
                },
                select: {
                    liked: true,
                },
            });

            // Query for bookmarked status
            const bookmarkedStatus = await prisma.userBookmarks.findUnique({
                where: {
                    userId_imageId_bookmark: {
                        userId: userId as string,
                        imageId: imageId as string,
                    },
                },
                select: {
                    bookmarked: true,
                },
            });

            return res.status(200).json({
                liked: likeStatus?.liked ?? false,
                bookmarked: bookmarkedStatus?.bookmarked ?? false,
            });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
