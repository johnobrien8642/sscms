import { NextApiRequest, NextApiResponse } from 'next';
import models from '@db/lib/index';
import Page from '@db/models/Page';
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
	const { formTitle } = req.query;
    const docs =
        await Page
            .find({
                showInNavigation: true,
                isPublished: true
            })
            .sort('formOrder')
            .select('_id title folderHref');
    return res.status(200).json({ docs });
};