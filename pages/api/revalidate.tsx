import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
	const { path } = req.body;
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ message: 'Invalid token' });
  	}
  	try {
		await res.revalidate(path as string);
		return res.json({ revalidated: true });
  	} catch (err) {
		return res.status(500).send('Error revalidating');
  	}
}