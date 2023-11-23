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
    const recordsPerPage = 9; // Adjust as per your requirement
    const recordsToSkip = pageNumber === 1 ? 3 : (pageNumber - 1) * recordsPerPage;

    try {
        let userVideos;
        const totalVideosCount = await prisma.image.count({
            where: { username: user as string }
        });


        if (pageNumber === 1) {
            // TODO: We can't efficient sum the engagmetnlikes AND this
            // to get the top popular videos
            const topPopularVideos = await prisma.image.findMany({
                where: { username: user as string },
                orderBy: { likeCount: 'desc' },
                take: 3
            });

            // Fetch the rest of the videos for the first page, excluding the top 3
            const remainingVideos = await prisma.image.findMany({
                where: {
                    username: user as string,
                    NOT: topPopularVideos.map(video => ({ id: video.id }))
                },
                orderBy: { createdAt: 'desc' },
                take: recordsPerPage - topPopularVideos.length
            });

            userVideos = [...topPopularVideos, ...remainingVideos];
        }


        else {
            // Fetch videos by date for pages other than the first
            userVideos = await prisma.image.findMany({
                where: { username: user as string },
                orderBy: { createdAt: 'desc' },
                take: recordsPerPage,
                skip: recordsToSkip
            });



        }

        // Calculate the number of videos already shown
        const shownVideos = (pageNumber - 1) * recordsPerPage + userVideos.length;
        // Calculate the remaining videos
        const remaining = Math.max(0, totalVideosCount - shownVideos);


        // const userThumbLinks = userVideos.map(video => ({
        //     const userLikesCount = await prisma.userEngagement.count({
        //         where: {
        //             imageId: video.id,
        //             liked: true
        //         },
        //     });

        //     thumbUrl: `${THUMBS_BASE_URL}${video.videoId}.jpg`,
        //     videoUrl: `${VIDEO_BASE_URL}${video.videoId}.mp4`,
        //     likeCount: video.likeCount,
        //     createdAt: video.createdAt
        // }));

        const userThumbLinks = await Promise.all(userVideos.map(async (video) => {
            const userLikesCount = await prisma.userEngagement.count({
                where: {
                    imageId: video.id,
                    liked: true
                },
            });

            return {
                thumbUrl: `${THUMBS_BASE_URL}${video.videoId}.jpg`,
                videoUrl: `${VIDEO_BASE_URL}${video.videoId}.mp4`,
                likeCount: video.likeCount,
                heartCount: video.heartCount, // Assuming you have this field in your Image model
                userLikesCount: userLikesCount,
                // totalEngagementCount: video.likeCount + video.heartCount + userLikesCount,
                totalLikeHeartEngageCount: (video.likeCount ? video.likeCount : 0) + (video.heartCount ? video.heartCount : 0) + (userLikesCount ? userLikesCount : 0),
                createdAt: video.createdAt
            };
        }));


        res.status(200).json({ userThumbLinks, remaining });
    } catch (error) {
        console.error('Error fetching user videos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

