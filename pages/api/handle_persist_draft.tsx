import { NextApiRequest, NextApiResponse } from 'next';
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
	const { draftDataStr, draftId, draftForId } = req.body;
	const draft = await Draft.findOne({ draftId });
	if (!draft) {
		await Draft.create({ dataStr: draftDataStr, draftId, draftForId });
	} else {
		draft.dataStr = draftDataStr;
		await draft.save();
	}
	return res.status(200).json({ success: true });
};