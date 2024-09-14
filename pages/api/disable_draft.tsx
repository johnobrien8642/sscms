import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(200).setDraftMode({ enable: false }).json({ success: true });
}