import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prismaClient';

const THUMBS_BASE_URL = 'https://thumbs-all.media-storage.us-west.qencode.com/';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	const { user } = req.query;

	try {
		const userVideos = await prisma.image.findMany({
			where: {
				username: user as string,
			},
			select: {
				videoId: true
			}
		})

        const userThumbLinks = userVideos.map((video) => {
            return `${THUMBS_BASE_URL}${video.videoId}.jpg`
        })

		if (userThumbLinks) {
			// console.log("userProfile", userProfile)
			res.status(200).json(userThumbLinks);
		} else {
			res.status(404).json({ message: 'User not found' });
		}
	} catch (error: any) {
		res.status(500).json({ message: 'Internal Server Error', error: error.message });
	}
}
