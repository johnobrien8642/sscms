import React from 'react';
import { Text, Box, Heading, Grid, Flex } from '@chakra-ui/react';
import { BasePropsType } from '@core/components/types/prop_types';
import { useBreakpointValue } from '@chakra-ui/react';

const Experience = ({ template }: BasePropsType) => {
	// const value = useBreakpointValue({
	// 	base: false,
	// 	md: true
	// });
	return <></>
	return (
		<Grid
			templateColumns={{ base: '1fr', md: '1fr 2fr' }}
			gap={{ md: '4.5rem' }}
			width={{ base: '90%', md: '75%' }}
			my='3rem'
			mr={{ md: 'auto' }}
			ml={{ md: '5rem' }}
			fontSize='1.2rem'
			maxW='1200px'
		>
			{
				template.assetsIds.map(obj => {
					return <>
						{obj.title && <Flex
							key={obj._id}
							flexDir='column'
						>
							<Text
								py='.5rem'
								pb='1rem'
								text-align={obj?.textAlign}
								whiteSpace='nowrap'
								fontStyle='italic'
							>
								{obj.title}
							</Text>
							{value !== 'base' && <Box
								width='25%'
								borderBottom='1px solid #eeeeef'
							/>}
						</Flex>}
						<Flex
							gap='3rem'
						>
							{value === 'base' && <Box
								width='25%'
								borderBottom='1px solid #eeeeef'
								height={{ base: '0', md: '3%' }}
								minW='5rem'
							/>}
							<Text
								as='span'
								dangerouslySetInnerHTML={{ __html: obj.richDescription ?? '' }}
								text-align={obj?.textAlign}
								fontSize='1.5rem'
								lineHeight='2.5'
								sx={{
									'h2': {
										fontSize: value === 'base' ? '1.5rem' : '2.5rem',
										lineHeight: value === 'base' ? '2.5rem' : '4rem'
									}
								}}
							/>
						</Flex>
					</>
				})
			}
		</Grid>
	)
}

export default Experience;