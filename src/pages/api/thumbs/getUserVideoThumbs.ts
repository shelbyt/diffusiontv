import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prismaClient';

//const THUMBS_BASE_URL = 'https://thumbs-all.media-storage.us-west.qencode.com/';
//const THUMBS_BASE_URL = 'https://ps-lofiagihab.s3.us-west-2.amazonaws.com/';
const VIDEO_BASE_URL = 'https://civ-all-encoded.media-storage.us-west.qencode.com/';
const THUMBS_BASE_URL = 'https://d10bxkdso1dzcx.cloudfront.net/';
//const THUMBS_BASE_URL = 'https://ps-wp-avcvmtusbw.s3.us-west-2.amazonaws.com/';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { user, page } = req.query;

    const pageNumber = Number(page) || 1;
    const recordsPerPage = 6; // Adjust as per your requirement
    const recordsToSkip = pageNumber === 1 ? 3 : (pageNumber - 1) * recordsPerPage;

    try {
        let userVideos;

        if (pageNumber === 1) {
            // Fetch top 3 most popular videos separately
            const topPopularVideos = await prisma.image.findMany({
                where: { username: user as string },
                orderBy: { likeCount: 'desc' },
                take: 3
            });

            // Fetch the rest of the videos for the first page by date
            const remainingVideos = await prisma.image.findMany({
                where: { username: user as string },
                orderBy: { createdAt: 'desc' },
                take: recordsPerPage - topPopularVideos.length
            });

            userVideos = [...topPopularVideos, ...remainingVideos];
        } else {
            // Fetch videos by date for pages other than the first
            userVideos = await prisma.image.findMany({
                where: { username: user as string },
                orderBy: { createdAt: 'desc' },
                take: recordsPerPage,
                skip: recordsToSkip
            });
        }

        const userThumbLinks = userVideos.map(video => ({
            thumbUrl: `${THUMBS_BASE_URL}${video.videoId}.jpg`,
            videoUrl: `${VIDEO_BASE_URL}${video.videoId}.mp4`,
            likeCount: video.likeCount,
            createdAt: video.createdAt
        }));

        res.status(200).json(userThumbLinks);
    } catch (error) {
        console.error('Error fetching user videos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

