import { NextApiRequest, NextApiResponse } from 'next';
import { FeedVideoList } from '../../../types'
import prisma from '../../../utils/prismaClient'
const VIDEO_BASE_URL = 'https://civ-all-encoded.media-storage.us-west.qencode.com/';
const THUMBS_BASE_URL = 'https://d10bxkdso1dzcx.cloudfront.net/';

// Function to fetch a random item from a category
async function getRandomItemFromCategory(categoryId: number, uuid: string) {
    const totalItems = await prisma.image.count({
        where: {
            category: categoryId,
            likeCount: {
                gt: 0 // Only select items with more than 10 likes
            }
        },

    });

    const randomOffset = Math.floor(Math.random() * totalItems);
    const query = {
        where: {
            category: categoryId,
            likeCount: {
                gt: 0 // Only select items with more than 1 like
            }
        },
        take: 1,
        skip: randomOffset,
        select: {
            id: true,
            category: true,
            videoId: true,
            remoteId: true,
            likeCount: true,
            heartCount: true,
            commentCount: true,
            width: true,
            height: true,
            username: true,
            meta: true,
            user: {
                select: {
                    imageUrl: true,
                    id: true
                },
            },
        },
    };

    const ree = await prisma.image.findMany(query);
    for (const item of ree) {
        const engagementCount = await prisma.userEngagement.count({
            where: { imageId: item.id, liked: true },
        });
        const bookmarkCount = await prisma.userBookmarks.count({
            where: { imageId: item.id, bookmarked: true },
        });
        (item as any)['bookmarkCount'] = Number(bookmarkCount || 0);
        (item as any)['likeHeartEngageCount'] = Number(item.likeCount || 0) +
            Number(item.heartCount || 0) +
            Number(engagementCount || 0);
    }
    return ree;
}

// Function to fetch random items from each category
// async function getRandomItemsFromAllCategories() {
//     const categories = [0, 1, 2, 3, 4, 5, 6]; // Integer categories
//     return await Promise.all(categories.map(categoryId =>
//         getRandomItemFromCategory(categoryId)
//     ));
// }

function createWeightedDistribution(categories: string | any[], weights: number[]) {
    const distribution = [];
    for (let i = 0; i < categories.length; i++) {
        for (let j = 0; j < weights[i]; j++) {
            distribution.push(categories[i]);
        }
    }
    return distribution;
}

function selectRandomItemsFromArray(array: string | any[], numberOfItems: number) {
    const selectedItems = [];
    for (let i = 0; i < numberOfItems; i++) {
        const randomIndex = Math.floor(Math.random() * array.length);
        selectedItems.push(array[randomIndex]);
    }
    return selectedItems;
}

async function getRandomItemsFromAllCategories(pageSize: number, uuid: string) {
    const categories = [0, 1, 2, 3, 4, 5, 6];
    const weights =    [20, 40, 1, 1, 20, 20, 20]; // Higher weight for category

    // const categories = [100];
    // const weights = [1]; // Higher weight for category

    const weightedDistribution = createWeightedDistribution(categories, weights);
    const selectedCategories = selectRandomItemsFromArray(weightedDistribution, pageSize); // Select 5 items, allowing duplicates

    return await Promise.all(selectedCategories.map(categoryId =>
        getRandomItemFromCategory(categoryId, uuid)
    ));
}

// Formatting function
function formatVideoData(videos: any[]): FeedVideoList[] {
    return videos.map((item: any) => ({
        data: {
            dbData: item, // Since the result is an array with one item
            storage: {
                videoUrl: `${VIDEO_BASE_URL}${item.videoId}.mp4`,
                thumbUrl: `${THUMBS_BASE_URL}${item.videoId}.jpg`
            }
        }
    }));
}

function formatVideoDataRecommended(videos: any[]): FeedVideoList[] {
    return videos.map((item: any) => ({
        data: {
            dbData: item[0], // Since the result is an array with one item
            storage: {
                videoUrl: `${VIDEO_BASE_URL}${item[0].videoId}.mp4`,
                thumbUrl: `${THUMBS_BASE_URL}${item[0].videoId}.jpg`
            }
        }
    }));
}

async function getLatestVideos(pageSize: number, currentPage: number, uuid: string) {
    return await prisma.image.findMany({
        where: {
            likeCount: {
                gt: 0 // Only select items with more than 1 like
            },
            nsfwLevel: {
                not: "X"
            }
        },
        take: pageSize,
        skip: pageSize * (currentPage - 1),
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            id: true,
            category: true,
            videoId: true,
            remoteId: true,
            likeCount: true,
            heartCount: true,
            commentCount: true,
            width: true,
            height: true,
            username: true,
            meta: true,
            user: {
                select: {
                    imageUrl: true,
                    id: true
                },
            },
        },
    });
}
// Next.js API handler
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, uuid, type = 'recommended', currentPage = 1 } = req.query;
    const pageSize = 7;
    console.log({ method, uuid, type });
    console.log("type = ", type)


    if (method === 'get') {
        try {
            let result;

            if (type === 'recommended') {
                console.log("inside recommended")
                const randomItemsResults = await getRandomItemsFromAllCategories(pageSize, uuid as string);
                const formattedRandomVideos = formatVideoDataRecommended(randomItemsResults);
                result = formattedRandomVideos;
            }

            if (type === 'latest') {
                const latestVideos = await getLatestVideos(pageSize, currentPage as number, uuid as string );
                const formattedLatestVideos = formatVideoData(latestVideos);
                result = formattedLatestVideos
            }
            console.log('result = ', result)

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}

export default handler;
