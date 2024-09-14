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
	const { _id } = req.query;
    const prev = 
		await BlogPost
			.findOne({ _id: { $lt: _id } })
			.sort('-createdAt')
			.select('title folderHref');
    const next = 
		await BlogPost
		.findOne({ _id: { $gt: _id } })
		.sort('createdAt')
		.select('title folderHref');
    return res.status(200).json({ prev, next });
};