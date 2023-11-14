import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prismaClient'

// Define the base URLs for your S3 bucket for videos and thumbnails
const VIDEO_BASE_URL = 'https://civ-all-encoded.media-storage.us-west.qencode.com/';
//const THUMBS_BASE_URL = 'https://thumbs-all.media-storage.us-west.qencode.com/';
//const THUMBS_BASE_URL = 'https://ps-lofiagihab.s3.us-west-2.amazonaws.com/';
const THUMBS_BASE_URL = 'https://d10bxkdso1dzcx.cloudfront.net/';


export interface IDbData {
    videoId: string;
    remoteId: number;
    heartCount: number | null;
    commentCount: number | null;
    username: string | null;
    user: {
        imageUrl: string | null;
    } | null;
}

export interface IDataStorage {
    videoUrl: string;
    thumbUrl: string;
}

export interface IVideoData {
    data: {
        dbData: IDbData;
        storage: IDataStorage;
    }
}
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const pageSize = 5; // Results per page
    let currentPage = 1;
    if (req.query.currentPage) {
        currentPage = Number(req.query.currentPage);
    }

    const { method } = req.query;

    async function getTopImages() {
        const images = await prisma.image.findMany({
            skip: (currentPage - 1) * pageSize,
            take: pageSize,
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                likeCount: {
                    gt:5 
                }
            },
            select: {
                videoId: true,
                remoteId: true,
                heartCount: true,
                commentCount: true,
                username: true,
                meta: true,
                user: {
                    select: {
                        imageUrl: true,
                    },
                },
            },
        });

        return images;
    }

    if (method == 'get') {
        const results = await getTopImages();

        // Map each result to include video URL, thumbnail URL, and DB data
        const videosWithThumbs: IVideoData[] = results.map(item => ({
            data: {
                dbData: item,
                storage: {
                    videoUrl: `${VIDEO_BASE_URL}${item.videoId}.mp4`,
                    thumbUrl: `${THUMBS_BASE_URL}${item.videoId}.jpg`
                }
            }
        }));

        // console.log(`Constructed URLs for ${videosWithThumbs.length} videos with thumbnails`);
        // console.log(videosWithThumbs)

        return res.status(200).json(videosWithThumbs);
    }

}

export default handler;
