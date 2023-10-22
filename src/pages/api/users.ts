import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../utils/prismaClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		const { email, username, sl_id, provider, imageUrl } = req.body;

		// Find or create user based on email
		let user = await prisma.user.findUnique({
			where: { email: email }
		});

		if (!user) {
			user = await prisma.user.create({
				data: {
					email: email,
					username: username,
					sl_id: sl_id,
					provider: provider,
					imageUrl: imageUrl,
				}
			});
		}

		return res.status(200).json(user);
	} else {
		res.status(405).end(); // Method Not Allowed
	}
}