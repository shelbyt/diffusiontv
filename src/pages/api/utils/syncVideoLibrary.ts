//@ts-nocheck
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import ApiVideoClient from '@api.video/nodejs-client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const client = new ApiVideoClient({ apiKey: process.env.API_KEY });

async function fetchAndStoreVideos() {
    let allVideos = [];
    for (let currentPage = 1; ; currentPage++) {
        const res = await client.videos.list({ currentPage });
        allVideos = [...allVideos, ...res.data];
        if (currentPage >= res.pagination.pagesTotal) {
            break;
        }
        break;
    }

    for (const video of allVideos) {
        const { videoId, tags, publishedAt, updatedAt, assets } = video;
        console.log(video)

        // Inserting or updating the video in the database
        const createdVideo = await prisma.video.upsert({
            where: { videoId },
            update: {},
            create: {
                videoId,
                publishedAt: new Date(publishedAt),
                updatedAt: new Date(updatedAt),
                tags: {
                    connectOrCreate: tags.map(tag => ({
                        where: { name: tag },
                        create: { name: tag }
                    }))
                },
                asset: {
                    create: {
                        iframe: assets.iframe,
                        player: assets.player,
                        hls: assets.hls,
                        thumbnail: assets.thumbnail,
                        mp4: assets.mp4,
                        videoId
                    }
                }
            }
        });
    }
}

// Call the function
fetchAndStoreVideos().catch(e => {
    console.error(e);
}).finally(async () => {
    await prisma.$disconnect();
});