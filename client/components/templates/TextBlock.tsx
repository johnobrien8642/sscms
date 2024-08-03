import React from 'react';
import { Text, Box, Heading } from '@chakra-ui/react';
import { BasePropsType } from '@core/components/types/prop_types';

const TextBlock = ({ template }: BasePropsType) => {
	return (
		<Box
			width={{ base: '90%', md: '75%' }}
			m='auto'
			mt={{ base: '2rem', md: '5rem' }}
			mb={{ base: '2rem', md: '5rem' }}
			fontSize='min(5vw, 2rem)'
		>
			{
				template.assetsIds.map(obj => {
					let resolveMargin;
					if (obj.textAlign === 'left' || !obj.textAlign) {
						resolveMargin = '0 auto 0 0'
					} else if (obj.textAlign === 'center') {
						resolveMargin = '0 auto'
					} else {
						resolveMargin = '0 0 0 auto'
					}
					return <Box
						width='82%'
						m={resolveMargin}
					>
						{obj.title && <Heading
							pb='1rem'
							as='h3'
							text-align={obj?.textAlign}
						>
							{obj.title}
						</Heading>}
						<Text
							as='span'
							dangerouslySetInnerHTML={{ __html: obj.richDescription ?? '' }}
							text-align={obj?.textAlign}
						/>
					</Box>

				})
			}
		</Box>
	)
}

export default TextBlock;