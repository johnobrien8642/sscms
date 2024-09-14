import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '@db/lib/mongodb';
import BlogPost from '@db/models/BlogPost';
import { blogPostSearch } from '@util/utils';
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await connectDb();
	const { skip, search, topic } = req.query;
	let query = {
		topic: topic,
		isPublished: true
	};
	if (search) {
		query = {
			...query,
			...blogPostSearch(search as string) 
		};
	}
	const posts = 
        await BlogPost
            .find(query)
            .sort('-publishedAt')
            .skip(parseInt(skip as string))
            .limit(6);
	return res.status(200).json({ posts });
};