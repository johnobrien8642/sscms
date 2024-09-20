import React from 'react';
import { useRouter } from 'next/router';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Header from '@core/components/system/Header';
import Templates from '@core/components/system/Templates';
import connectDb from '@db/lib/mongodb';
import { Center, Spinner, Tag } from '@chakra-ui/react';
import Page, { PageType } from '@db/models/Page';
import BlogPost, { BlogPostType } from '@db/models/BlogPost';
import { GetStaticProps, NextPage } from 'next';
import Settings, { SettingsType } from '@db/models/Settings';
import models from '@db/lib';
import Draft from '@db/models/Draft';
import TemplateMap from '@core/components/client-templates/TemplateMap';

export type SlugPropsType = {
	page: string;
	headerPages: string;
	settings: any;
}

const Home: NextPage<SlugPropsType> = ({ page, headerPages, settings }) => {
	const router = useRouter();
	const BlogDetail = TemplateMap[process.env.NEXT_PUBLIC_SITE_FOLDER as string]['BlogDetail'];
	if (router.isFallback) {
		return <Center
			overflow='hidden'
		>
			<Spinner mt='10rem' boxSize={24} thickness='.4rem' />
		</Center>
	}
	if (!page) {
		return <></>
	} else {
		const pPage = JSON.parse(page);
		const pHeaderPages: PageType[] = JSON.parse(headerPages);
		const pSettings: SettingsType = JSON.parse(settings);
		return (
			<>
				<Head>
					{
						(pPage?.meta?.metaTitle || pPage?.title) && 
							<title>{(pPage?.meta?.metaTitle) ?? pPage?.title}</title>
					}
					{
						(pPage?.meta?.metaDescription || pPage?.description) &&
							<meta
								name="description"
								content={pPage?.meta?.metaDescription as string ?? pPage?.description as string}
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
					pages={pHeaderPages}
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
					a {
						text-decoration: underline;
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
	const headerPages =
		await Page
			.find({
				showInNavigation: true,
				isPublished: true
			})
			.sort('formOrder')
			.select('_id title folderHref');
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
				page: JSON.stringify(page),
				headerPages: JSON.stringify(headerPages)
			}
		};
	}
}


export default Home;
