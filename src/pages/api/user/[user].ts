// pages/api/user/[user].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserData } from '../../../utils/getUserData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;

  try {
    const userObject = await getUserData(username as string);
    
    if (userObject) {
      res.status(200).json(userObject);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
