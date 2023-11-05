import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prismaClient'

// Define the base URLs for your S3 bucket for videos and thumbnails
const S3_VIDEO_BASE_URL = '';
const S3_THUMBS_BASE_URL = '';


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

    if (method == 'get') {
        async function getTopImages() {
            const images = await prisma.image.findMany({
                skip: (currentPage - 1) * pageSize,
                take: pageSize,
                orderBy: {
                    heartCount: 'asc',
                },
                select: {
                    videoId: true,
                    remoteId: true,
                    heartCount: true,
                    commentCount: true,
                    username: true,
                    user: {
                        select: {
                            imageUrl: true,
                        },
                    },
                },
            });

            return images;
        }

        const results = await getTopImages();

        // Map each result to include video URL, thumbnail URL, and DB data
        const videosWithThumbs: IVideoData[] = results.map(item => ({
            data: {
                dbData: item,
                storage: {
                    videoUrl: `${S3_VIDEO_BASE_URL}${item.videoId}.mp4`,
                    thumbUrl: `${S3_THUMBS_BASE_URL}${item.videoId}.jpg`
                }
            }
        }));

        console.log(`Constructed URLs for ${videosWithThumbs.length} videos with thumbnails`);
        console.log(videosWithThumbs)

        return res.status(200).json(videosWithThumbs);
    }

    // ... (The rest of your endpoint logic, like the 'patch' method, remains unchanged)
}

export default handler;
