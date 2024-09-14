import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '@db/lib/mongodb';
import Settings from '@db/models/Settings';
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await connectDb();
    let settings;
    settings = await Settings.findOne({});
    if (!settings) {
        settings = await new Settings({});
        await settings.save();
    }
    return res.status(200).json({ item: settings });
};
