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
	const { formTitle, items } = req.body;
    let bulk = [];
	for (let i = 0; i < items.length; i++) {
        bulk.push({
            'updateOne': {
                'filter': { '_id': items[i]._id },
                'update': { formOrder: i },
                'upsert': false
            }
        })
    }
    await models[formTitle as string].bulkWrite(bulk)
    return res.status(200).json({});
};