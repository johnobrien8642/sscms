import React from 'react';
import { BasePropsType } from '@core/components/types/prop_types';
import { Flex, Box, Button, Center } from '@chakra-ui/react';
import Link from 'next/link';
import MyImage from '@core/components/system/Image';

const LinkList = ({ template }: BasePropsType ) => {
	return (
		<Flex
			mb='15rem'
			flexDir={{ base: 'column', md: 'row' }}
		>
			{template.assetsIds.map(asset => {
				return <Box
					position='relative'
					width='fit-content'
					m='2rem'
				>
					<Flex
						justifyContent='center'
						alignItems='center'
						flexDir={{ base: 'column', md: 'row' }}
					>
						<MyImage image={asset} maxW='200px' />
						<Box
							ml={{ base: '0', md: '2rem' }}
							mt={{ base: '2rem', md: '0'}}
						>
							<Link
								href={asset.extLink ?? ''}
							>
								<Button>
									{asset.extLinkText}
								</Button>
							</Link>
						</Box>
					</Flex>
					<Box 
						position='absolute' 
						width='20%' 
						borderBottom='1px solid white'
						top='115%'
					/>
				</Box>
			})}
		</Flex>
	)
}

export default LinkList;