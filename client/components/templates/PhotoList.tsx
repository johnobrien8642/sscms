import React, { useState } from 'react'
import {
	Grid,
	Flex,
	useBreakpointValue
} from '@chakra-ui/react';
import MyImage from '@core/components/system/Image';
import ImageFocus from '@core/components/system/ImageFocus';
import ImageInfo from '@core/components/system/ImageInfo';
import { AssetsType } from '@core/models/Assets';
import { TemplatesType } from '@core/models/Templates';
import { BasePropsType } from '@core/components/types/prop_types';

const PhotoList = ({ template }: BasePropsType) => {
	const [image, setImage] = useState<AssetsType | undefined>();
	const [openModal, setOpenModal] = useState(false);
	const assets = template?.assetsIds;
	const desktop = useBreakpointValue(
		{
			base: false,
			md: true
		}
	)

	return <Flex
		flexDir='column'
		width='90%'
		m='5rem auto'
	>
		{
			assets?.map((asset, index) => {
				return <Grid
					key={asset._id.toString()}
					gridTemplateColumns={{ base: '100%', lg: '50% 1fr'}}
					gap={{ base: '0', md: '2%' }}
					width='100%'
					my={{ base: '1rem', md: '2rem' }}
					pt={{ base: '1rem', md: '2rem' }}
					px={{ base: '.5rem', md: '2rem' }}
					borderTop='1px solid white'
					alignItems='center'
				>
					<MyImage image={asset} setPhotoHook={setImage} setOpenModalHook={setOpenModal} priority={index < 2} />
					<ImageInfo image={asset} />
				</Grid>
			})
		}
		<ImageFocus assets={image} setOpenModalHook={setOpenModal} openModalBool={openModal} />
	</Flex>
}

export default PhotoList;