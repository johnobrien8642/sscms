import React, { useRef } from "react";
import {
	useDisclosure,
	Flex,
	Text,
	VStack,
	IconButton,
	useBreakpointValue,
	Box
} from "@chakra-ui/react";
import Link from "next/link";
import { HamburgerIcon } from '@chakra-ui/icons';
import MobileHeaderDrawers from "./MobileHeaderDrawers";
import { PageType } from "@db/models/Page";
import { siteFontsDefaultObj } from "@util/fonts";

const MobileHeader = ({ pages }: { pages: PageType[] }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef: React.MutableRefObject<HTMLButtonElement | null> = useRef(null);
	const desktop = useBreakpointValue(
		{
			base: false,
			md: true
		}
	)
	return (
		<Flex
			ml='auto'
			display={desktop ? 'none' : 'block'}
			className={
				siteFontsDefaultObj
					?.['header']
					?.[process.env.NEXT_PUBLIC_SITE_FOLDER ?? '']
					?.className
			}
		>
			<IconButton
				ref={btnRef}
				onClick={onOpen}
				icon={<HamburgerIcon />}
				aria-label='Hamburger Icon'
			/>

			<MobileHeaderDrawers
				isOpen={isOpen}
				onClose={onClose}
			>
				<VStack 
					alignItems="left"
					width='100%'
				>
					{pages.map((obj, i) => {
						if (obj.folderHref !== '/') {
							return <Box
								key={obj._id}
								borderBottom='solid white'
								width='100%'
								pb='.4rem'
							>
								<Text
									fontSize='1rem'
								>
									<Link
										key={i}
										href={obj.folderHref ?? ''}
										passHref
										onClick={onClose}
									>
										{obj.title}
									</Link>
								</Text>
							</Box>
						}
					})}
				</VStack>
			</MobileHeaderDrawers>
		</Flex>
	);
};

export default MobileHeader;