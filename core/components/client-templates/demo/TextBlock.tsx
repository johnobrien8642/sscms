import React from 'react';
import { Text, Box, Heading } from '@chakra-ui/react';
import { BasePropsType } from '@core/components/types/prop_types';

const TextBlock = ({ template }: BasePropsType) => {
	return (
		<Box
			m='auto'
			mt={{ base: '1rem', md: '3rem' }}
			fontSize='min(3.5vw, 1.3rem)'
			lineHeight='min(7vw, 2.4rem)'
			p={{ base: '0.5rem', md: '0' }}
		>
			{
				template.textIds.map(obj => {
					let resolveMargin;
					if (obj.textAlign === 'left' || !obj.textAlign) {
						resolveMargin = '0 auto 0 0'
					} else if (obj.textAlign === 'center') {
						resolveMargin = '0 auto'
					} else {
						resolveMargin = '0 0 0 auto'
					}
					return <Box
						key={obj._id}
						// width='82%'
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