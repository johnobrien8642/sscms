import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '@db/lib/mongodb';
import Admin from '@db/models/Admin';
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await connectDb();
	try {
		const admin = await Admin.find({});
		return res.status(200).json({ admin: !!admin?.length });
	} catch (err) {
		return res.status(500).json({ error: `check_admin_exists failed: ${err}` });
	}
};