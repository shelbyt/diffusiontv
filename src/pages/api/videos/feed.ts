//@ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
//const VIDEO_BASE_URL = 'https://civ-all-encoded.media-storage.us-west.qencode.com/';
const VIDEO_BASE_URL = 'https://psv-uttzefxkok.s3.us-west-2.amazonaws.com/'
//const THUMBS_BASE_URL = 'https://thumbs-all.media-storage.us-west.qencode.com/';
//const THUMBS_BASE_URL = 'https://ps-lofiagihab.s3.us-west-2.amazonaws.com/';
const THUMBS_BASE_URL = 'https://d10bxkdso1dzcx.cloudfront.net/';


// Function to fetch a random item from a category
async function getRandomItemFromCategory(categoryId) {
    const totalItems = await prisma.Image.count({
        where: {
            category: categoryId,
            likeCount: {
                gt: 1 // Only select items with more than 10 likes
            }
        },

    });

    const randomOffset = Math.floor(Math.random() * totalItems);
    return await prisma.Image.findMany({
        where: {
            category: categoryId,
            likeCount: {
                gt: 1 // Only select items with more than 10 likes
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
            username: true,
            meta: true,
            category: true,
            user: {
                select: {
                    imageUrl: true,
                    id: true
                },
            },
        },
    });
}



// Function to fetch random items from each category
// async function getRandomItemsFromAllCategories() {
//     const categories = [0, 1, 2, 3, 4, 5, 6]; // Integer categories
//     return await Promise.all(categories.map(categoryId =>
//         getRandomItemFromCategory(categoryId)
//     ));
// }

function createWeightedDistribution(categories, weights) {
    let distribution = [];
    for (let i = 0; i < categories.length; i++) {
        for (let j = 0; j < weights[i]; j++) {
            distribution.push(categories[i]);
        }
    }
    return distribution;
}

function selectRandomItemsFromArray(array, numberOfItems) {
    let selectedItems = [];
    for (let i = 0; i < numberOfItems; i++) {
        let randomIndex = Math.floor(Math.random() * array.length);
        selectedItems.push(array[randomIndex]);
    }
    console.log(selectedItems)
    return selectedItems;
}

async function getRandomItemsFromAllCategories(pageSize: number) {
    const categories = [ 0, 1, 2, 3, 4, 5, 6];
    const weights =    [1, 1, 1, 6, 4, 2, 1]; // Higher weight for category 3

    const weightedDistribution = createWeightedDistribution(categories, weights);
    const selectedCategories = selectRandomItemsFromArray(weightedDistribution,pageSize); // Select 5 items, allowing duplicates

    return await Promise.all(selectedCategories.map(categoryId => 
        getRandomItemFromCategory(categoryId)
    ));
}



// Formatting function
function formatVideoData(videos) {
    return videos.map(item => ({
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
    const { method } = req.query;
    const pageSize = 5;

    if (method === 'get') {
        console.log('called')
        try {
            const randomItemsResults = await getRandomItemsFromAllCategories(pageSize);
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
