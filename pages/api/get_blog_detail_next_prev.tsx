import { Types } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import BlogPost from '@db/models/BlogPost'
import connectDb from '@db/lib/mongodb';
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await connectDb();
	const { publishedAt } = req.query;
    const prev = 
		await BlogPost
			.findOne({ publishedAt: { $lt: new Date(publishedAt as string) }, isPublished: true })
			.sort('publishedAt')
			.select('title folderHref publishedAt');
    const next = 
		await BlogPost
		.findOne({ publishedAt: { $gt: new Date(publishedAt as string) }, isPublished: true })
		.sort('publishedAt')
		.select('title folderHref publishedAt');
    return res.status(200).json({ prev, next });
};