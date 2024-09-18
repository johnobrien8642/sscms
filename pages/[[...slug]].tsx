import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@core/components/system/Header';
import Templates from '@core/components/system/Templates';
import connectDb from '@db/lib/mongodb';
import { Tag } from '@chakra-ui/react';
import Page, { PageType } from '@db/models/Page';
import BlogPost, { BlogPostType } from '@db/models/BlogPost';
import { GetStaticProps, NextPage } from 'next';
import Settings, { SettingsType } from '@db/models/Settings';
import models from '@db/lib';
import Draft from '@db/models/Draft';
import TemplateMap from '@core/components/client-templates/TemplateMap';

export type SlugPropsType = {
	page: string;
	settings: any;
}

const Home: NextPage<SlugPropsType> = ({ page, settings }) => {
	const BlogDetail = TemplateMap[process.env.NEXT_PUBLIC_SITE_FOLDER as string]['BlogDetail'];
	const [headerLinks, setHeaderLinks] = useState();
	useEffect(() => {
		handleGetHeaderLinks();
		async function handleGetHeaderLinks() {
			const res = await fetch('/api/get_header_links', {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				cache: 'no-store'
			});
			const { docs } = await res.json();
			setHeaderLinks(docs)
		}
	}, []);
	if (!page) {
		return <></>
	} else {
		const pPage: PageType | BlogPostType = JSON.parse(page);
		const pSettings: SettingsType = JSON.parse(settings);
		return (
			<>
				<Head>
					<title>{(pPage.typeName === 'Page' && pPage?.meta?.metaTitle) || pPage?.title}</title>
					{
						pPage.typeName === 'Page' && 
							<meta
								name="description"
								content={pPage?.meta?.metaDescription as string || pPage?.description as string}
							/>
					}
					<link rel="canonical" href='' />
					{
						!!pSettings?.siteFavicon.length &&
							<link 
								rel="icon" 
								type="image/icon" 
								href={process.env.NEXT_PUBLIC_CLOUDFRONT_URL as string + pSettings.siteFavicon[0].assetKey}
							/>
					}
				</Head>
				<Header
					pages={headerLinks ?? []}
					settings={pSettings}
				/>
				{pSettings?.location &&
					<Tag
						size={{ base: 'xs', lg: 'xl'}}
						variant='subtle'
						colorScheme='green'
						p='.8rem 1rem'
						fontSize='min(3vw, 1rem)'
						boxShadow='1px 1px 1px black'
						m='1rem'
					>
						Current location: {pSettings?.location}
					</Tag>
				}
				{
					pPage.folderHref?.includes('blog-detail') &&
						<BlogDetail page={pPage as BlogPostType} />
				}
				{
					!pPage.folderHref?.includes('detail') &&
						<Templates templates={pPage.templatesIds} />
				}
				<style jsx global>{`
	  				body {
						height: 100vh;
						background: ${pSettings?.siteBgGradient};
						background-image: ${pSettings?.siteBodyBgImage};
					}
	  			`}</style>
			</>
		);
	}
}

export const getStaticPaths = async () => {
	await connectDb();
	const pages =
		await Page
			.find({
				isPublished: true
			});
	const blogPosts =
		await BlogPost
			.find({
				isPublished: true
			});
	let paths: any = [];
	let paths2: any = [];
	if (pages) {
		paths = pages?.map((obj: any) => {
			return {
				params: {
					slug: [ obj.folderHref.substring(1) ]
				}
			}
		});
	}
	if (blogPosts) {
		paths2 = blogPosts?.map((obj: any) => {
			return {
				params: {
					slug: [ ...obj.folderHref.substring(1).split('/') ]
				}
			}
		});
	}
	return {
		paths: [...paths, ...paths2],
		fallback: true
	}
}
// Need to refactor out of pageManager
export const getStaticProps: GetStaticProps<SlugPropsType> = async (context) => {
	await connectDb();
	let filter: any = {};
	const settings =
		await Settings
			.findOne({})
				.populate('siteLogo siteFavicon siteBodyBgImage');
	let folderHref;
	if (!context.params?.slug) {
		folderHref = '/';
	} else if (typeof context.params?.slug === 'string') {
		folderHref = context.params?.slug;
	} else if (Array.isArray(context.params?.slug)) {
		folderHref = `/${context.params?.slug.join('/')}`;
	}
	let page;
	let DraftDoc;
	const blogPostPopulateArr = [
		{
			path: 'mainImage',
			model: 'Assets',
		},
		{
			path: 'templatesIds',
			model: 'Templates',
			populate: [
				{
					path: 'textIds',
					model: 'Text'
				},
				{
					path: 'assetsIds',
					model: 'Assets'
				},
				{
					path: 'linksIds',
					model: 'Assets'
				},
				{
					path: 'pagesIds',
					model: 'Page'
				},
				{
					path: 'videoId',
					model: 'Assets'
				}
			],
		}
	];
	const pagePopulateArr = [
		{
			path: 'templatesIds',
			model: 'Templates',
			populate: [
				{
					path: 'textIds',
					model: 'Text'
				},
				{
					path: 'assetsIds',
					model: 'Assets'
				},
				{
					path: 'linksIds',
					model: 'Assets'
				},
				{
					path: 'pagesIds',
					model: 'Page'
				},
				{
					path: 'videoId',
					model: 'Assets'
				}
			],
		}
	];
	if (context.preview) {
		//@ts-ignore
		const draft = await Draft.findOne({ draftId: context.previewData?.draftId });
		const draftDocParsed = JSON.parse(draft.dataStr);
		DraftDoc = new models[draftDocParsed.schemaName as string](draftDocParsed);
	} else {
		filter = {
			folderHref,
			isPublished: true,
			isActiveDraft: true
		}
	}
	if (context.preview) {
		page =
			await DraftDoc
				.populate(DraftDoc.schemaName === 'BlogPost' ? blogPostPopulateArr : pagePopulateArr);
	} else if (folderHref?.includes('blog-detail')) {
		page =
			await BlogPost
				.findOne(filter)
					.populate(blogPostPopulateArr);
	} else {
		page =
			await Page
				.findOne(filter)
					.populate(pagePopulateArr);
	}
	if (!page) {
		return {
			redirect: {
				permanent: false,
				destination: "/404",
			}
		};
	} else {
		return {
			props: {
				settings: JSON.stringify(settings),
				page: JSON.stringify(page)
			}
		};
	}
}


export default Home;
