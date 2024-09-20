import connectDb from '@db/lib/mongodb';
import { NextApiResponse } from 'next';
import Page, { PageType } from '@db/models/Page';
import BlogPost from '@db/models/BlogPost';

function generateSiteMap(data: PageType[]) {
	return `<?xml version="1.0" encoding="UTF-8"?>
	<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
		<url>
			<loc>${process.env.NEXT_PUBLIC_URL}</loc>
		</url>
		${data
			.map((page) => {
				 return `
					<url>
						<loc>${`${process.env.NEXT_PUBLIC_URL}${page.folderHref}`}</loc>
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
	const data1 = 
		await Page
			.find({
				isPublished: true
			})
			.select('folderHref');
	const data2 = 
		await BlogPost
			.find({
				isPublished: true
			})
			.select('folderHref');

	// We generate the XML sitemap with the posts data
	const sitemap = generateSiteMap([...data1, ...data2] as PageType[]);

	res.setHeader('Content-Type', 'text/xml');
	// we send the XML to the browser
	res.write(sitemap);
	res.end();

	return {
		props: {}
	};
}

export default SiteMap;
