import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prismaClient';

//const THUMBS_BASE_URL = 'https://thumbs-all.media-storage.us-west.qencode.com/';
//const THUMBS_BASE_URL = 'https://ps-lofiagihab.s3.us-west-2.amazonaws.com/';

const THUMBS_BASE_URL = 'https://d10bxkdso1dzcx.cloudfront.net/';
//const THUMBS_BASE_URL = 'https://ps-wp-avcvmtusbw.s3.us-west-2.amazonaws.com/';
const VIDEO_BASE_URL = 'https://civ-all-encoded.media-storage.us-west.qencode.com/';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { user, page = 1 } = req.query; // Default page = 1
    const pageSize = 9; // Hardcoded page size

    const pageNumber = parseInt(page as string);

    try {
        // First, get the total number of engagements
        // const totalEngagements = await prisma.userEngagement.count({
        //     where: {
        //         userId: user as string,
        //         liked: true
        //     },
        // });

		const totalBookmarks = await prisma.userBookmarks.count({
			where: {
				userId: user as string,
				bookmarked: true
			}
		})

        // Calculate the offset for pagination
        const offset = (pageNumber - 1) * pageSize;

        // Get the paginated user engagements
        const userLikes = await prisma.userBookmarks.findMany({
            where: {
                userId: user as string,
                bookmarked: true
            },
            select: {
                image: {
                    select: {
                        id: true,
                        videoId: true,
                        likeCount: true,
                        heartCount: true
                    }
                },
                createdAt: true
            },
            take: pageSize,
            skip: offset,
            orderBy: {
                createdAt: 'desc'
            }
        });

        const userThumbLinks = await Promise.all(userLikes.map(async (video) => {
            const userLikesCount = await prisma.userEngagement.count({
                where: {
                    imageId: video.image.id,
                    liked: true
                },
            });

            return {
                thumbUrl: `${THUMBS_BASE_URL}${video.image.videoId}.jpg`,
                videoUrl: `${VIDEO_BASE_URL}${video.image.videoId}.mp4`,
                likeCount: video.image.likeCount,
                heartCount: video.image.heartCount,
                userLikesCount: userLikesCount,
                totalLikeHeartEngageCount: (video.image.likeCount ? video.image.likeCount : 0) + 
                                           (video.image.heartCount ? video.image.heartCount : 0) + 
                                           (userLikesCount ? userLikesCount : 0),
                createdAt: video.createdAt
            };
        }));

        // Calculate the number of videos already shown
        const shownVideos = (pageNumber - 1) * pageSize + userLikes.length;
        // Calculate the remaining videos
        const remaining = Math.max(0, totalBookmarks - shownVideos);

        if (userThumbLinks) {
            res.status(200).json({ userThumbLinks, remaining });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
