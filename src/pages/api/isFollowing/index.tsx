// pages/api/checkFollowing.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import getIsFollowing from '../../../utils/getIsFollowing'; // Adjust the import path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { followerId, followingId } = req.query;
    if (!followerId || !followingId) {
        res.status(400).json({ error: 'followerId or followingId is missing' });
        return;
    }

    try {
        const isFollowing = await getIsFollowing(followerId as string, followingId as string);
        res.status(200).json({ isFollowing });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
