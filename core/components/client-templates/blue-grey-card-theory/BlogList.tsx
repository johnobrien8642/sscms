import React, { useEffect, useState } from 'react';
import dateFormat from "dateformat";
import { Box, Flex, Heading, Text, Link, Input } from '@chakra-ui/react';
import { BlogPostType } from '@db/models/BlogPost';
import MyImage from '@core/components/system/Image';
import Pagination from '@core/components/system/Pagination';
import SubscribeForm from '@core/components/system/SubscribeForm';
import { BasePropsType } from '@core/components/types/prop_types';

const BlogList = ({ template }: BasePropsType) => {
	const topicType = template.blogListTopic;
	const [blogPosts, setBlogPosts] = useState<BlogPostType[]>([]);
	const [blogPostsCount, setBlogPostsCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [search, setSearch] = useState('');
	const perPage = 6;
	const maxW = '600px';
	useEffect(() => {
		getTotalBlogPosts()
		async function getTotalBlogPosts() {
			const res = await fetch(`/api/get_total_blog_posts/?search=${search}&topic=${topicType}`);
			const resData = await res.json();
			const { postsCount } = resData;
			setBlogPostsCount(postsCount);
		}
	}, [search]);
	useEffect(() => {
		getBlogPosts()
		async function getBlogPosts() {
			if (blogPostsCount) {
				const res = await fetch(`/api/get_blog_posts/?search=${search}&topic=${topicType}&skip=${currentPage === 1 ? 0 : (currentPage * perPage) - perPage}`);
				const resData = await res.json();
				const { posts } = resData;
				setBlogPosts(posts)
			} else {
				setBlogPosts([]);
			};
		}
	}, [blogPostsCount, currentPage, search]);
	return <Flex 
		flexDir='column'
		justifyContent='space-between'
		// height='100dvh'
		mt='3rem'
		width={{ base: '95%', md: '60%' }}
		position='relative'
	>
		<Input 
			placeholder='Search blogs...'
			onInput={e => {
				setSearch(e.currentTarget.value);
			}}
			width={{ base: '70%', md: '60%' }}
			mb='1rem'
			position='relative'
			right={{ base: '0', md: '50%' }}
		/>
		<Flex
			flexDir='column'
			height='100%'
		>
			{blogPosts.map(post => {
				return <Flex
					key={post._id}
					flexDir='column'
					justifyContent='normal'
					height='fit-content'
					width='100%'
					maxW={maxW}
					mb='5%'
				>
					{
						!!post.mainImage.length && 
							<MyImage
								image={post.mainImage[0]} 
								maxW={maxW}
								cursor='normal'
							/>
					}
					<Box
						mt='1rem'
					>
						<Link
							href={process.env.NEXT_PUBLIC_URL as string + post.folderHref as string}
						>
							<Heading>{post.title}</Heading>
						</Link>
						<Text mt='.5rem'>{post.subHeading}</Text>
						<Text mt='1rem' fontSize='.8rem'>{dateFormat(new Date(post.publishedAt), "dddd, mmmm dS, yyyy")}</Text>
					</Box>
				</Flex>
			})}
		</Flex>
		<SubscribeForm />
		<Pagination
			current={currentPage}
			totalItems={blogPostsCount}
			onChange={setCurrentPage}
			pageSize={perPage}
		/>
	</Flex>;
}

export default BlogList;