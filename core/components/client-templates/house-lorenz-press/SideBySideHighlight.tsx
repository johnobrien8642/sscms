import React from 'react';
import { Heading, Grid } from '@chakra-ui/react';
import { BasePropsType } from '@core/components/types/prop_types';
import MyImage from '@core/components/system/Image';
import { useBreakpointValue } from '@chakra-ui/react';
import ScrollAnimation from 'react-animate-on-scroll';

const SideBySideHighlight = ({ template }: BasePropsType) => {
	const asset1 = template.assetsIds[0];
	const text = template.textIds[0];

	return (
		<Grid
			position='relative'
			gridTemplateColumns={{ base: '1fr', lg: '25% 1fr' }}
			gap={{ base: '1rem', lg: '1rem' }}
			m='auto'
			mt={{ base: '1rem', md: '3rem' }}
			p={{ base: '1rem', md: '0' }}
		>
			<ScrollAnimation
				className='sbs-higlight-image'
				animateIn='fadeIn'
				animateOnce={true}
				delay={600}
			>
				<MyImage
					image={asset1}
					maxW={{ base: '300px', md: '90%' }}
					cursor='normal'
				/>
			</ScrollAnimation>
			<ScrollAnimation
				className='sbs-higlight-text'
				animateIn='fadeIn'
				animateOnce={true}
				delay={700}
				style={{
					height: 'fit-content',
					margin: 'auto',
					position: 'relative'
				}}
			>
				<Heading
					textAlign='center'
					fontWeight='normal'
					fontStyle='italic'
					dangerouslySetInnerHTML={{ __html: text.richDescription ?? '' }}
				/>
			</ScrollAnimation>
		</Grid>
	)
}

export default SideBySideHighlight;