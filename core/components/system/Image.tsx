import React, { SetStateAction } from 'react';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import Image from 'next/image';
import { AssetsType } from '@db/models/Assets';

const MyImage = ({
	image,
	height,
	setPhotoHook,
	setOpenModalHook,
	padding,
	priority,
	maxW,
	margin,
	cursor
}: {
	image: AssetsType;
	height?: number;
	setPhotoHook?: React.Dispatch<React.SetStateAction<AssetsType | undefined>>;
	setOpenModalHook?: React.Dispatch<React.SetStateAction<boolean>>;
	padding?: number;
	priority?: boolean;
	maxW?: any;
	margin?: string;
	cursor?: string;
}) => {
	const desktop = useBreakpointValue(
		{
			base: false,
			md: true
		}
	)
	return <Box
		key={image._id.toString()}
		width='100%'
		maxW={maxW ? maxW : '825px'}
		padding={padding}
		height={height}
		m={margin ? margin : 'auto'}
		sx={{
			':hover': {
				cursor: `${cursor ? cursor : 'pointer'}`
			},
			img: {
				width: '100%',
				height: '100%',
				objectFit: 'contain'
			}
		}}
		alignContent='center'
		objectFit='contain'
		onClick={() => {
			if (desktop) {
				if (setPhotoHook) {
					setPhotoHook(image)
				}
				if (setOpenModalHook) {
					setOpenModalHook(true)
				}
			}
		}}
	>

	</Box>
}

export default MyImage;