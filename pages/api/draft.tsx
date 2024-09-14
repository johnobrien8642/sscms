import models from '@db/lib/index';
import connectDb from '@db/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ message: 'Invalid token' });
	}
	await connectDb();
	const item = 
		await models[req.query.schemaName as string]
			.findOne({ _id: req.query.draftId })
				.select('folderHref');
	res.setPreviewData({ draftId: item._id });
	res.redirect(item.folderHref);
  }