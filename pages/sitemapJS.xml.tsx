import connectDb from '../lib/mongodb';
import { NextApiResponse } from 'next';
import Page, { PageType } from '../models/Page';

function generateSiteMap(data: PageType[]) {
	return `<?xml version="1.0" encoding="UTF-8"?>
	<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
		<url>
			<loc>https://www.houselorenzpress.com</loc>
		</url>
		${data
			.map((page) => {
				 return `
					<url>
						<loc>${`https://www.houselorenzpress.com${page.folderHref}`}</loc>
					</url>
				`;
			})
			.join('')}
	</urlset>
 `;
}

function SiteMap() {
	// getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }: { res: NextApiResponse }) {
	await connectDb();
	// We make an API call to gather the URLs for our site
	const data = await Page.find({});

	// We generate the XML sitemap with the posts data
	const sitemap = generateSiteMap(data as PageType[]);

	res.setHeader('Content-Type', 'text/xml');
	// we send the XML to the browser
	res.write(sitemap);
	res.end();

	return {
		props: {}
	};
}

export default SiteMap;
