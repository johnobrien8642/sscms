import { NextApiRequest, NextApiResponse } from 'next';
import models from '@db/lib/index';
import connectDb from '@db/lib/mongodb';
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
	const { 
		formTitle, 
		skip, 
		limit, 
		formItemOrder, 
		draftsKey, 
		draftsValue,
		search,
		topic
	} = req.query;
	let filter = {};
	let totalItems: any;
	if (draftsKey && draftsValue) {
		filter = {
			[`${draftsKey}`]: draftsValue
		};
	} else {
		filter = {
			isNestedChild: false,
			isActiveDraft: true
		};
	}
	if (search) {
		filter = {
			...filter,
			...blogPostSearch(search as string)
		}
	}
	if (topic) {
		filter = {
			...filter,
			topic: topic
		}
	}
	if (models[formTitle as string]) {
		const items = 
			await models[formTitle as string]
				.find(filter)
				.sort(formItemOrder ? 'formOrder' : '-isPublished -isActiveDraft -updatedAt')
				.skip(parseInt(skip as string))
				.limit(parseInt(limit as string));
		if (!draftsKey && !draftsValue) {
			totalItems = 
				await models[formTitle as string]
					.countDocuments();
		}
		return res.status(200).json({ items, totalItems });
	} else {
		return res.status(401).json({ error: 'That wasnt a valid model' });
	}
};