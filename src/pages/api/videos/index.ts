import ApiVideoClient from '@api.video/nodejs-client'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prismaClient'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const defaultApiKey = process.env.API_KEY

    const sortBy = 'publishedAt'; // Allowed: publishedAt, title. You can search by the time videos were published at, or by title.
    const sortOrder = 'asc'; // Allowed: asc, desc. asc is ascending and sorts from A to Z. desc is descending and sorts from Z to A.
    const pageSize = 2; // Results per page. Allowed values 1-100, default is 25. Loading 2 at a time is really good
    let currentPage = 1;
    if (req.query.currentPage) {
        currentPage = Number(req.query.currentPage)
    }


    const { videoId, metadata } = req.body
    const { method } = req.query
    const client = new ApiVideoClient({
        apiKey: defaultApiKey,
    })

    if (method == 'get') {
        async function getTopImages() {
            const images = await prisma.image.findMany({
                skip: (currentPage - 1) * pageSize,
                take: pageSize,
                orderBy: {
                    commentCount: 'desc',
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
        const videoIds = results.map(item => `${item.videoId}.mp4`);

        console.log(`Fetching ${videoIds.length} videos`);

        // Create an array of promises
        const videoPromises = videoIds.map(title => client.videos.list({ title }));

        // Wait for all promises to resolve
        const allResults = await Promise.all(videoPromises);

        // Merge all the results
        const mergedVideosListResponse = {
            ...allResults[0], // Take the first object as a base
            data: allResults.flatMap(result => result.data) // Flat map all the data arrays into one
                .map((item, index) => ({
                    ...item,
                    meta: results[index],
                })),
        };

        return res.status(200).json({ ...mergedVideosListResponse });


    }

    // UPDATE DATA
    if (method === 'patch') {
        const videoUpdatePayload = {
            metadata, // A list (array) of dictionaries where each dictionary contains a key value pair that describes the video. As with tags, you must send the complete list of metadata you want as whatever you send here will overwrite the existing metadata for the video.
        }

        const result = await client.videos.update(videoId, videoUpdatePayload)
        res.status(204).send(result)
        return
    }
}
export default handler
