import React, { useState, useEffect, useCallback } from "react";
import {
	Flex,
	Button,
	HStack,
	chakra,
	Text,
	Box,
	useBreakpointValue,
	useDisclosure
} from '@chakra-ui/react';
import Link from 'next/link'
import { useRouter } from 'next/router';
import Logout from './Logout';
import MobileHeader from "./MobileHeader";
import { PageType } from "@db/models/Page";
import HeaderPanel from "./HeaderPanel";
import { siteFontsDefaultObj } from "@util/fonts";

const Header = ({ pages, settings }: { pages: PageType[], settings: any; }) => {
	const [loggedIn, setLoggedIn] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const router = useRouter();
	const desktop = useBreakpointValue(
		{
			base: false,
			md: true
		}
	)

	useEffect(() => {
		if(window.localStorage.getItem(process.env.NEXT_PUBLIC_LOGGED_IN_VAR as string)) {
			setLoggedIn(true)
		}
	}, [])

	if (settings?.headerNestedDropdown) {
		return (
			<chakra.header 
				id="header" 
				className={
					siteFontsDefaultObj
						?.['header']
						?.[process.env.NEXT_PUBLIC_SITE_FOLDER ?? '']
						?.className
				}
			>
				<Flex
					w="100%"
					px="6"
					py='1rem'
					align="center"
					justify="space-between"
				>
					<Button
						variant='link'
						mr={desktop ? '2rem' : '0'}
						sx={{
							':hover': {
								textDecoration: 'none'
							}
						}}
						onClick={(e) => {
							e.preventDefault();
							router.push('/');
						}}
					>
						{
							!!settings?.siteLogo.length &&
								<Box
									width='50px'
									mr='1rem'
								>
									<img src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + settings.siteLogo[0]?.assetKey} />
								</Box>
						}
						<Text
							as='h2'
							sx={{ ':hover': { cursor: 'pointer' } }}
							fontWeight='600'
							fontSize='min(5vw, 2rem)'
							whiteSpace='pre-wrap'
						>
							{settings?.siteTitle}
						</Text>
					</Button>
					<HeaderPanel pages={pages} />
				</Flex>
			</chakra.header>
		);
	} else {
		return (
			<chakra.header 
				id="header"
				className={
					siteFontsDefaultObj
						?.['header']
						?.[process.env.NEXT_PUBLIC_SITE_FOLDER ?? '']
						?.className
				}
			>
				<Flex
					w="100%"
					px="6"
					py='1rem'
					align="center"
					// justify="space-between"
				>
					<Button
						variant='link'
						mr={desktop ? '2rem' : '0'}
						sx={{
							':hover': {
								textDecoration: 'none'
							}
						}}
						onClick={(e) => {
							e.preventDefault();
							router.push('/');
						}}
					>
						{
							!!settings?.siteLogo.length &&
								<Box
									width='50px'
									mr='1rem'
								>
									<img src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + settings.siteLogo[0]?.assetKey} />
								</Box>
						}
						<Text
							as='h2'
							sx={{ ':hover': { cursor: 'pointer' } }}
							fontWeight='600'
							fontSize='min(4.2vw, 1.5rem)'
						>
							{settings?.siteTitle}
						</Text>
					</Button>

					{!!pages.length &&
						<MobileHeader
							pages={pages}
						/>
					}

					<HStack
						display={desktop ? 'flex' : 'none'}
						as="nav"
						spacing='1.5rem'
						position='relative'
					>
						{pages.map((obj, i) => {
							if (obj.folderHref !== '/') {
								return <Box
										key={obj._id}
									>
										<Text
											key={obj._id}
											fontSize='1rem'
											fontWeight='bold'
											whiteSpace='nowrap'
											sx={{
												'a:hover': {
													color: 'lightgray'
												}
											}}
										>
											<Link
												key={i}
												href={obj.folderHref ?? ''}
												passHref
											>
												{obj.title}
											</Link>
										</Text>
									</Box>
								}
							})}
						<Box>
						{loggedIn && <Logout />}
						</Box>
					</HStack>
				</Flex>
			</chakra.header>
		);
	}
}

export default Header;