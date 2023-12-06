import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prismaClient';
import { Prisma, UserPlays } from '@prisma/client';

interface RequestBody {
	userId: string;
	imageId: string;
	videoDuration: number;
	totalWatchTime: number;
	agent: Prisma.InputJsonValue | undefined; // Updated type for agent
}

type ResponseData = UserPlays | { error: string };

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
) {
	if (req.method === 'POST') {
		const { userId, imageId, videoDuration, totalWatchTime, agent } = req.body as RequestBody;

		try {
			const newUserPlay = await prisma.userPlays.create({
				data: {
					userId,
					imageId,
					videoDuration,
					totalWatchTime,
					agent: agent === null ? Prisma.JsonNull : agent,
				},
			});

			res.status(200).json(newUserPlay);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ error: `Server error: ${error.message}` });
			} else {
				res.status(500).json({ error: 'Unknown server error' });
			}
		}
	} else {
		res.setHeader('Allow', ['POST']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
