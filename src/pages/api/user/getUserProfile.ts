import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prismaClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { user } = req.query;

    try {
        const userProfile = await prisma.user.findUnique({
            where: {
                username: user as string,
            },
            select: {
                username: true,
                imageUrl: true,
            },
        });

        const userStats = await prisma.image.aggregate({
            where: {
                username: user as string,
            },
            _sum: {
                likeCount: true,
            },
            _count: {
                _all: true
            },
        });

        const userObject = {
            ...userProfile,
            likeCount: userStats._sum.likeCount || 0,
            videosMade: userStats._count._all

        }
        if (userObject) {
            // console.log("userProfile", userProfile)
            res.status(200).json(userObject);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
