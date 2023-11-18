import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prismaClient';

//const THUMBS_BASE_URL = 'https://thumbs-all.media-storage.us-west.qencode.com/';
//const THUMBS_BASE_URL = 'https://ps-lofiagihab.s3.us-west-2.amazonaws.com/';
const VIDEO_BASE_URL = 'https://civ-all-encoded.media-storage.us-west.qencode.com/';
const THUMBS_BASE_URL = 'https://d10bxkdso1dzcx.cloudfront.net/';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	const { user } = req.query;

	try {
		const userVideos = await prisma.image.findMany({
			where: {
				username: user as string,
			},
			select: {
				videoId: true,
				likeCount: true,
				createdAt: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		const userThumbLinks = userVideos.map((video) => {
			// return `${THUMBS_BASE_URL}${video.videoId}.jpg`
			return {
				thumbUrl: `${THUMBS_BASE_URL}${video.videoId}.jpg`,
                videoUrl: `${VIDEO_BASE_URL}${video.videoId}.mp4`,
				likeCount: video.likeCount,
				createdAt: video.createdAt

			}
		})

		if (userThumbLinks) {
			// console.log("userProfile", userProfile)
			res.status(200).json(userThumbLinks);
		} else {
			res.status(404).json({ message: 'User not found' });
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(500).json({ message: 'Internal Server Error', error: error.message });
		} else {
			res.status(500).json({ message: 'Internal Server Error' });
		}

	}
}
