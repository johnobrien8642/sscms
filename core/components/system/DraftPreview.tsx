import { Box, Button, Spinner, Flex, useBreakpointValue } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import IframeResizer from '@iframe-resizer/react';
import Link from 'next/link';
import { FaMobileScreen, FaDesktop } from "react-icons/fa6";

const DraftPreview = ({
	draftId,
	schemaName,
	desktopView,
	setDesktopView
}: {
	draftId: string;
	schemaName: string;
	desktopView: boolean;
	setDesktopView: React.Dispatch<React.SetStateAction<boolean>>
}) => {
	const iframeEl = useRef<HTMLIFrameElement | null>(null);
	const iframeContEl = useRef<HTMLDivElement | null>(null);
	const [loading, setLoading] = useState(true);
	const desktop = useBreakpointValue({
		base: false,
		lg: true
	})
	return <Box
		mb={desktop ? '15rem' : '1rem'}
		mx='auto'
		width={desktopView ? '100%' : '420px'}
		height={{ base: '100vh', lg: '100%' }}
		position='relative'
		top='10%'
		zIndex={99}
		overflow='hidden'
		ref={iframeContEl}
	>
		<Flex mb='1rem' gap='1rem'>
			<Button onClick={() => { setDesktopView(true) }}><FaDesktop /></Button>	
			<Button onClick={() => { setDesktopView(false)  }}><FaMobileScreen /></Button>	
			<Link
				target='_blank'
				href={{ 
					pathname : process.env.NEXT_PUBLIC_URL + `/api/draft/?draftId=${draftId}&schemaName=${schemaName}`,
					query: { draft: true }
				}}
				rel='noopener noreferrer'
			>
				<Button mb='1rem' ml='1rem'>View Draft</Button>
			</Link>
		</Flex>
		{loading && <Spinner size='xl' position='relative' top='15%' left='50%' />}
		<IframeResizer 
			license='GPLv3'
			src={process.env.NEXT_PUBLIC_URL + `/api/draft/?draftId=${draftId}&schemaName=${schemaName}`}
			width='100%'
			height='100%'
			scrolling={true}
			forwardRef={iframeEl}
			style={{ transformOrigin: '0px 0px', transform: desktop ? 'scale(.6)' : 'scale(1)', width: desktop && desktopView ? '1200px' : '100%', height: !desktop ? '600px' : '100%'}}
			onLoad={(e) => {
				setLoading(false);
			}}
		/>
	</Box>
	

};

export default DraftPreview;