import { NextApiRequest, NextApiResponse } from 'next';
import models from '@db/lib/index';
import Draft from '@db/models/Draft';
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
	const { schemaName} = req.query;
	await models[schemaName as string].updateMany({}, { beingDrafted: false });
	await Draft.deleteMany({});
    return res.status(200).json({ success: true });
};