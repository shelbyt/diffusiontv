//@ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
//const VIDEO_BASE_URL = 'https://civ-all-encoded.media-storage.us-west.qencode.com/';
const VIDEO_BASE_URL = 'https://psv-uttzefxkok.s3.us-west-2.amazonaws.com/'
//const THUMBS_BASE_URL = 'https://thumbs-all.media-storage.us-west.qencode.com/';
//const THUMBS_BASE_URL = 'https://ps-lofiagihab.s3.us-west-2.amazonaws.com/';
const THUMBS_BASE_URL = 'https://d10bxkdso1dzcx.cloudfront.net/';


// Function to fetch a random item from a category
async function getRandomItemFromCategory(categoryId, uuid) {
    console.log("got UUID = in get random ", uuid)
    const totalItems = await prisma.Image.count({
        where: {
            category: categoryId,
            likeCount: {
                gt: 1 // Only select items with more than 10 likes
            }
        },

    });

    const randomOffset = Math.floor(Math.random() * totalItems);
    // const query = {
    //     where: {
    //         category: categoryId,
    //         likeCount: {
    //             gt: 1 // Only select items with more than 1 like
    //         }
    //     },
    //     take: 1,
    //     skip: randomOffset,
    //     select: {
    //         id: true,
    //         category: true,
    //         videoId: true,
    //         remoteId: true,
    //         likeCount: true,
    //         heartCount: true,
    //         commentCount: true,
    //         username: true,
    //         meta: true,
    //         user: {
    //             select: {
    //                 imageUrl: true,
    //                 id: true
    //             },
    //         },
    //         // Conditionally add this part
    //         // ...(uuid !== 'unauth' && {
    //             engagement: {
    //                 // where: {
    //                 //     userId: uuid
    //                 // },
    //                 select: {
    //                     liked: true,
    //                     // other fields if needed
    //                 }
    //             }
    //         // })
    //     },
    // };
    // const ree = await prisma.Image.findMany(query);
    // Construct the raw SQL query
    // Use tagged template literals for the raw query
    // uuid = "clo0wrpcf0000umd818ziecrp"
    const sqlQuery = prisma.$queryRaw`
        SELECT 
            img.id,
            img.category,
            img.videoId,
            img.remoteId,
            img.likeCount,
            img.heartCount,
            img.commentCount,
            img.username,
            img.meta,
            usr.imageUrl AS user_imageUrl,
            usr.id AS user_id,
            eng.liked,
            eng.bookmarked

        FROM 
            Image img
        LEFT JOIN 
            User usr ON img.username = usr.username
        LEFT JOIN 
            (SELECT 
                ue.liked,
                ue.bookmarked,
                ue.imageId
            FROM 
                UserEngagement ue
            WHERE 
                ue.userId = ${uuid === 'unauth' ? null : uuid}
            ) AS eng ON img.id = eng.imageId
        WHERE 
            img.category = ${categoryId} AND 
            img.likeCount > 1
        LIMIT 1
        OFFSET ${randomOffset}
    `;

    const rawResults = await sqlQuery;
    console.log("rawResults = ", rawResults)

    // Organize data as required
    const organizedResults = rawResults.map(item => ({
        id: item.id,
        category: item.category,
        videoId: item.videoId,
        remoteId: item.remoteId,
        likeCount: item.likeCount,
        heartCount: item.heartCount,
        commentCount: item.commentCount,
        username: item.username,
        meta: item.meta,
        user: {
            imageUrl: item.user_imageUrl,
            id: item.user_id
        },
        engagement: {
            liked: item.liked === 1,
            bookmarked: item.bookmarked === 1
        }
    }));

    console.log("organizedResults = ", organizedResults)
    return organizedResults;



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

async function getRandomItemsFromAllCategories(pageSize: number, uuid: string) {
    const categories = [0, 1, 2, 3, 4, 5, 6];
    const weights = [1, 1, 1, 6, 4, 1, 1]; // Higher weight for category 3

    const weightedDistribution = createWeightedDistribution(categories, weights);
    const selectedCategories = selectRandomItemsFromArray(weightedDistribution, pageSize); // Select 5 items, allowing duplicates

    return await Promise.all(selectedCategories.map(categoryId =>
        getRandomItemFromCategory(categoryId, uuid)
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
    const { method, uuid } = req.query;
    const pageSize = 5;

    if (method === 'get') {
        console.log('called')
        try {
            const randomItemsResults = await getRandomItemsFromAllCategories(pageSize, uuid);
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
