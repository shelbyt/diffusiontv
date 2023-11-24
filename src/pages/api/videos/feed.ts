// import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { FeedVideoList, RawResult } from '../../../types'
import prisma from '../../../utils/prismaClient'
// const prisma = new PrismaClient();
const VIDEO_BASE_URL = 'https://civ-all-encoded.media-storage.us-west.qencode.com/';
//const VIDEO_BASE_URL = 'https://psv-uttzefxkok.s3.us-west-2.amazonaws.com/'
//const THUMBS_BASE_URL = 'https://thumbs-all.media-storage.us-west.qencode.com/';
//const THUMBS_BASE_URL = 'https://ps-lofiagihab.s3.us-west-2.amazonaws.com/';
const THUMBS_BASE_URL = 'https://d10bxkdso1dzcx.cloudfront.net/';
//const THUMBS_BASE_URL = 'https://ps-wp-avcvmtusbw.s3.us-west-2.amazonaws.com/';

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

    // ree.forEach((item: any) => {
    //     item['likeHeartEngageCount'] = Number(item.likeCount || 0) +
    //         Number(item.heartCount || 0) +
    //         Number(item?.totalEngagements ? (item.totalEngagements as { _count: number })._count : 0);
    //     delete item.totalEngagements;
    // });

    // ree.forEach((item: any) => {
    //     item['bookmarkCount'] = item.UserBookmarks._count;
    //     delete item.UserBookmarks;
    // });

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
    const categories = [0, 1, 2, 3, 4, 5, 6, 99];
    const weights =    [1, 1, 6, 1, 4, 1, 1, 1]; // Higher weight for category

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
            dbData: item[0], // Since the result is an array with one item
            storage: {
                videoUrl: `${VIDEO_BASE_URL}${item[0].videoId}.mp4`,
                thumbUrl: `${THUMBS_BASE_URL}${item[0].videoId}.jpg`
            }
        }
    }));
}

// Next.js API handler
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, uuid } = req.query;
    const pageSize = 7;

    if (method === 'get') {
        try {
            const randomItemsResults = await getRandomItemsFromAllCategories(pageSize, uuid as string);
            const formattedRandomVideos = formatVideoData(randomItemsResults);

            return res.status(200).json(formattedRandomVideos);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}

export default handler;
