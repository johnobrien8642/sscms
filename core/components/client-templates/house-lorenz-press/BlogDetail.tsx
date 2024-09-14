import React, { useEffect, useMemo, useState } from 'react';
import dateFormat from "dateformat";
import { Box, Flex, Heading, Text, Link } from '@chakra-ui/react';
import { BlogPostType } from '@db/models/BlogPost';
import MyImage from '@core/components/system/Image';
import Templates from '@core/components/system/Templates';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import SubscribeForm from '@core/components/system/SubscribeForm';

const BlogDetail = ({ page }: { page: BlogPostType }) => {
	const [prevAndNext, setPrevAndNext] = useState<{ prev?: any, next?: any}>({});
	useEffect(() => {
		getPrevAndNextPosts()
		async function getPrevAndNextPosts() {
			const res = await fetch(`/api/get_blog_detail_next_prev/?_id=${page._id}`,
				{
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					cache: 'no-store'
				})
				const data = await res.json();
				const { prev, next } = data;
				console.log(prev, next)
				setPrevAndNext({ prev, next });
		}
	}, []);
	return <Flex
		flexDir='column'
		height='100%'
		m='auto'
	>
		<Flex
			flexDir='column'
			m='auto'
			w={{ base: '100%', md: '60%' }}
		>
			<Heading 
				as='h1' 
				fontSize='min(10vw, 3.5rem)'
				p={{ base: '0 .3rem', md: '0' }}
			>
				{page.title}
			</Heading>
			<Text
				m='.2rem 0 1rem 0'
				fontSize='min(4vw, 1.2rem)'
				p={{ base: '0 .3rem', md: '0' }}
			>
				{page.subHeading}
			</Text>
			<Text 
				mb='.7rem' 
				fontSize='min(3vw, .9rem)'
				p={{ base: '0 .3rem', md: '0' }}
			>
				{page.author + ' / ' + dateFormat(new Date(page.publishedAt), "dddd, mmmm dS, yyyy", true) + (page.location ? ' / ' + page.location : '')}
			</Text>
			{
				!!page.mainImage.length && 
					<MyImage
						image={page.mainImage[0]} 
						maxW='100%'
						cursor='normal'
					/>
			}
		</Flex>
		<Templates templates={page.templatesIds} width={{ base: '100%', md: '60%' }} />
		<SubscribeForm />
		<Flex
			w={{ base: '100%', md: '60%' }}
			m='auto'
			my='1rem'
		>
			{
				prevAndNext.prev && 
					<Link
						display='flex'
						flexDir='column'
						alignItems='center'
						mr='auto'
						href={prevAndNext.prev.folderHref}
						w='35%'
						p={{ base: '0 .3rem', md: '0' }}
					>
						<Text fontSize='min(3vw, 1.2rem)' textAlign='center'>{prevAndNext.prev.title}</Text>
						<ArrowBackIcon fontSize='min(5vw, 3rem)' m='auto' />
					</Link>
			}
			{
				prevAndNext.next && 
					<Link
						display='flex'
						flexDir='column'
						alignItems='center'
						ml='auto'
						href={prevAndNext.next.folderHref}
						w='35%'
						p={{ base: '0 .3rem', md: '0' }}
					>
						<Text fontSize='min(3vw, 1.2rem)' textAlign='center'>{prevAndNext.next.title}</Text>
						<ArrowForwardIcon fontSize='min(5vw, 3rem)' m='auto' />
					</Link>
			}
		</Flex>
	</Flex>
}

export default BlogDetail;