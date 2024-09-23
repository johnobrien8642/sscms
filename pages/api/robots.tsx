import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
const robotsStr = 
`
User-agent: *
Allow: /
Disallow: /admin
Sitemap: ${process.env.NEXT_PUBLIC_URL}/sitemap.xml
`
	res.send(robotsStr);
	return;
};