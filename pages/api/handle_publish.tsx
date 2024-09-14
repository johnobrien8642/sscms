import { NextApiRequest, NextApiResponse } from 'next';
import models from '@db/lib/index';
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
	const { itemId, schemaName, publish } = req.body;
	const item = await models[schemaName as string].findOne({ _id: itemId });
	try {
		if (publish) {
			item.isActiveDraft = publish;
			item.isPublished = publish;
			item.publishedAt = new Date();
			await item.save();
			await models[schemaName as string]
				.updateMany(
					{ 
						_id: { $ne: itemId },
						folderHref: item.folderHref 
					}, 
					{ 
						isPublished: !publish,
						isActiveDraft: !publish
					}
				) 
		} else {
			item.isPublished = publish;
			await item.save();
		}
		try {
			await res.revalidate(item.folderHref);
		} catch(err) {
		}
		return res.status(200).json({ success: true });
	} catch(err: any) {
		return res.status(500).json({ success: false, errorMessage: err.message });
	}
};