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
	const { search, topic } = req.query;
	let query = {
		topic: topic
	};
	if (search) {
		query = 
			{
				...query,
				...blogPostSearch(search as string)
			}
	}
	const postsCount = 
        await BlogPost
            .countDocuments(query);
	return res.status(200).json({ postsCount });
};