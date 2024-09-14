import React from 'react'
import {
	Heading,
	Box,
	Grid,
	Flex,
	Button,
	Text
} from '@chakra-ui/react';
import ScrollAnimation from 'react-animate-on-scroll';
import Image from 'next/image';
import Link from 'next/link';
import { BasePropsType } from '@core/components/types/prop_types';
import "animate.css/animate.compat.css"

const BookCoverCTA = ({ template }: BasePropsType) => {
	const asset = template.assetsIds[0];
	return <Flex
		flexDir='column'
		width='90%'
		m='auto'
		mb='8rem'
	>
		<ScrollAnimation
			animateIn='zoomInDown'
			animateOnce={true}
		>
			<Heading
				py='2rem'
				textAlign='center'
				borderTop='1px solid white'
				borderBottom='1px solid white'
				my='5rem'
				fontSize='min(5rem, 14vw)'
				whiteSpace='pre-wrap'
				wordBreak='break-word'
			>
				{asset.title?.toUpperCase()}
			</Heading>
		</ScrollAnimation>
		<Grid
			gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr'}}
			gap={10}
			justifyItems='center'
			alignItems='center'
			w={{ base: '80%' }}
			m='auto'
		>
			<Box>
				<ScrollAnimation
					animateIn='fadeInRight'
					animateOnce={true}
					delay={300}
				>
					<Image
						sizes='30w, (min-width: 520px) 65vw, (min-width: 1200px) 90vw'
						width={asset.assetDimensions[0]}
						height={asset.assetDimensions[1]}
						alt={asset.title ?? 'Book Cover CTA Image'}
						src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL as string + asset.assetKey}
					/>
				</ScrollAnimation>
			</Box>
			<Box>
				<ScrollAnimation
					animateIn='fadeInRight'
					animateOnce={true}
					delay={500}
				>
					<Heading fontSize='3.2rem' mb='2rem'>{asset.description}</Heading>
				</ScrollAnimation>
				<ScrollAnimation
					animateIn='fadeInRight'
					animateOnce={true}
					delay={600}
				>
					<Link href={asset.extLink ?? ''} passHref={true}>
						<Button
							variant='outline'
							sx={{
								':hover': {
									backgroundColor: '#535353'
								}
							}}
							padding='2rem'
							fontSize='1.5rem'
						>
							Buy the book
						</Button>
					</Link>
				</ScrollAnimation>
				<ScrollAnimation
					animateIn='fadeInRight'
					animateOnce={true}
					delay={700}
				>
					<Text
						as='span'
						display='inline-block'
						mt='2rem'
						lineHeight='2rem'
						fontSize='1.2rem'
						dangerouslySetInnerHTML={{ __html: asset.richDescription ?? '' }}
					/>
				</ScrollAnimation>
			</Box>
		</Grid>
	</Flex>
}

export default BookCoverCTA;