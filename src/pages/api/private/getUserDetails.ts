import type { NextApiRequest, NextApiResponse } from 'next';
import { getPrivateUserData } from '../../../utils/getPrivateUserData';

// TODO: Technically username can't be null. getPrivateUD handles it
type UserData = {
	username: string | null;
	id: string;
	imageUrl: string | null;
	likeCount: number;
	videosMade: number;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<UserData | { message: string }>
) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method Not Allowed' });
	}
	try {
		const sl_id = req.query.sl_id as string;
		if (!sl_id) {
			return res.status(400).json({ message: 'Missing user ID' });
		}
		const userData = await getPrivateUserData(sl_id);

		return res.status(200).json(userData);
	} catch (error) {
		console.error('Request error', error);

		// Check if the error is due to a user not being found or username being null
		if (error instanceof Error && error.message === 'User not found or username is null') {
			return res.status(404).json({ message: 'User not found or username is null' });
		}

		// For other types of errors
		res.status(500).json({ message: 'Error fetching user data' });
	}

}
