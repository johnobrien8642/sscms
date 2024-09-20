import React from 'react'
import {
	Flex
} from '@chakra-ui/react';
import { BasePropsType } from '@core/components/types/prop_types';
import Image from 'next/image';

const SinglePhotoHighlight = ({ template }: BasePropsType) => {
	const image = template.assetsIds[0];

	return <Flex
		flexDir='column'
		width={{ base: '100%', md: '90%', lg: '65%' }}
		m='5rem auto'
	>
		<Image
			sizes='30w, (min-width: 520px) 65vw, (min-width: 1200px) 90vw'
			alt={image.title || 'alt text'}
			width={image.assetDimensions[0]}
			height={image.assetDimensions[1]}
			src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL as string + image.assetKey}
		/>
	</Flex>
}

export default SinglePhotoHighlight;