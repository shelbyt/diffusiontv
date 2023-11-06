import ApiVideoClient from '@api.video/nodejs-client'
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prismaClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const defaultApiKey = process.env.API_KEY
    const client = new ApiVideoClient({
        apiKey: defaultApiKey,
    })

    // Grab the 'username' parameter from the URL
    const { user } = req.query;

    try {
        // Fetch user profile data from Prisma
        // const userProfile = await prisma.user.findUnique({
        //     where: {
        //         username: user as string,
        //     },
        //     select: {
        //         username: true,
        //         imageUrl: true,
        //         images: {
        //             select: {
        //                 videoId: true,
        //             },
        //             orderBy: {
        //                 likeCount: 'desc',
        //             },
        //         },
        //     },
        // });

        const userProfile = await prisma.user.findUnique({
            where: {
                username: user as string,
            },
            select: {
                username: true,
                imageUrl: true,
            },
        });

        const userStats = await prisma.image.aggregate({
            where: {
                username: user as string, 
            },
            _sum: {
                likeCount: true,
            },
            _count: {
                _all: true
            },
        });

        const userObject = {
            ...userProfile,
            likeCount: userStats._sum.likeCount || 0,
            videosMade: userStats._count._all

        }



        // const userProfileImages = userProfile?.images.map(image => image.videoId) || [];

        // const userVideoLists = await Promise.all(
        //     userProfileImages.map(videoId => client.videos.list({ tags: [videoId] }))
        // );

        // // Create an array of objects containing both thumbnail and videoId
        // const videoInfo = userVideoLists.flatMap(response =>
        //     response.data.map(video => ({
        //         thumbnail: video.assets?.thumbnail,
        //         videoId: video.videoId
        //     }))
        // );

        // console.log(videoInfo);

        // const userObj = {
        //     userProfile,
        //     userVideo: videoInfo,
        // }



        // console.log(userProfileImages)
        // const userVideoList = await client.videos.list({ tags: ["7cadbc25-f206-4c96-84bc-90cbe5711721"] })
        // console.log(userVideoList)

        // Now get the thumbnail data

        // Return the user profile data
        if (userObject) {
            // console.log("userProfile", userProfile)
            res.status(200).json(userObject);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
