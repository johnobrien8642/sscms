import React from 'react';
import { Text, Box, Heading, Grid } from '@chakra-ui/react';
import { BasePropsType } from '@core/components/types/prop_types';
import MyImage from '@core/components/system/Image';
import { useBreakpointValue } from '@chakra-ui/react';

const SideBySide = ({ template }: BasePropsType) => {
	const desktop = useBreakpointValue({
		base: false,
		md: true
	});
	const asset1 = template.assetsIds[0];
	const text = template.textIds[0];

	return (
		<Grid
			gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }}
			gap={{ base: '1rem', lg: '5rem' }}
			m='auto'
			mt={{ base: '1rem', md: '3rem' }}
			fontSize='min(3.5vw, 1.3rem)'
			lineHeight='min(7vw, 2.4rem)'
			p={{ base: '0.5rem', md: '0' }}
		>
			<MyImage
				image={asset1}
				maxW={{ base: '300px', md: '100%' }}
				cursor='normal'
			/>
			<Text
				as='span'
				dangerouslySetInnerHTML={{ __html: text.richDescription ?? '' }}
			/>
		</Grid>
	)
}

export default SideBySide;