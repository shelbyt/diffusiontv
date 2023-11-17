// pages/api/user/[sl_id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { sl_id } = req.query;
    console.log("calling me")

	if (!sl_id) {
		return res.status(400).json({ error: 'Auth0 ID is required' });
	}

	try {
		const user = await prisma.user.findUnique({
			where: { sl_id: sl_id as string },
		});
        // console.log("user data we got is ==", user)

		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404).json({ error: 'User not found' });
		}
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
}
