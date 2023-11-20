import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prismaClient';

//const THUMBS_BASE_URL = 'https://thumbs-all.media-storage.us-west.qencode.com/';
//const THUMBS_BASE_URL = 'https://ps-lofiagihab.s3.us-west-2.amazonaws.com/';

const THUMBS_BASE_URL = 'https://d10bxkdso1dzcx.cloudfront.net/';
//const THUMBS_BASE_URL = 'https://ps-wp-avcvmtusbw.s3.us-west-2.amazonaws.com/';
const VIDEO_BASE_URL = 'https://civ-all-encoded.media-storage.us-west.qencode.com/';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { user } = req.query;

    try {
        const userLikes = await prisma.userEngagement.findMany({
            where: {
                userId: user as string,
                liked: true
            },
            select: {
                image: {
                    select: {
                        videoId: true,
                    }
                },
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        const userThumbLinks = userLikes.map((video) => {
            return {
                thumbUrl: `${THUMBS_BASE_URL}${video.image.videoId}.jpg`,
                videoUrl: `${VIDEO_BASE_URL}${video.image.videoId}.mp4`,
                createdAt: video.createdAt

            }
        })

        if (userThumbLinks) {
            // console.log("userProfile", userProfile)
            res.status(200).json(userThumbLinks);
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
