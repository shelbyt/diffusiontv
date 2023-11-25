import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prismaClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId, page = '1' } = req.query;
    const pageNumber = parseInt(page as string);
    if (isNaN(pageNumber) || pageNumber < 1) {
        res.status(400).json({ message: 'Invalid page number' });
        return;
    }

    const PAGE_SIZE = 100; // Hardcoded page size

    try {
        const following = await prisma.follow.findMany({
            where: {
                followerId: userId as string,
                status: true
            },
            include: {
                following: {
                    select: {
                        username: true,
                        imageUrl: true // Assuming 'profileImage' field exists in User model
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: (pageNumber - 1) * PAGE_SIZE,
            take: PAGE_SIZE
        });

        const userList = following.map(f => ({
            username: f.following.username,
            imageUrl: f.following.imageUrl 
        }));

        res.status(200).json(userList);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}
