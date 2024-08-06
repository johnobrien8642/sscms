
import React from 'react';
import { Text, Box, Heading } from '@chakra-ui/react';
import { BasePropsType } from '@core/components/types/prop_types';

const HeadlineOnlyCTA = ({ template }: BasePropsType) => {
	const asset = template.assetsIds[0];
	return (
		<Box
			m='auto'
			fontSize='1.2rem'
		>
			<Heading
				textAlign='center'
				borderTop='1px solid white'
				borderBottom='1px solid white'
				my={{ base: '1rem', md: '3rem' }}
				fontSize='min(4rem, 10vw)'
				whiteSpace='pre-wrap'
				wordBreak='break-word'
			>
				{asset.title?.toUpperCase()}
			</Heading>
		</Box>
	)
}

export default HeadlineOnlyCTA;