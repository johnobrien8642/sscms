import React, { useState, useEffect } from "react";
import {
	Flex,
	HStack,
	chakra,
	Text,
	Box,
	Button,
	useBreakpointValue
} from '@chakra-ui/react';
import Link from 'next/link'
import { useRouter } from 'next/router';
import Logout from './Logout';

const AdminHeader = ({ selected }: { selected: string; }) => {
	const [loggedIn, setLoggedIn] = useState(false)
	const pages = ['Pages', 'Blog'];
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

	return (
		<chakra.header id="header">
			<Flex
				w="100%"
				px="6"
				py='1rem'
				align="center"
			>
				{
					pages.map(page => {
						return <Button
							key={page}
							variant='link'
							mr={desktop ? '2rem' : '0'}
							sx={{
								color: selected === page ? 'black' : 'gray',
								':hover': {
									textDecoration: 'none'
								}
							}}
							onClick={(e) => {
								e.preventDefault();
								router.push(`/admin/manage-${page.toLowerCase()}`);
							}}
						>
							<Text
								as='h2'
								sx={{ ':hover': { cursor: 'pointer' } }}
								fontWeight='400'
								fontSize='min(7vw, 2rem)'
							>
								{`Manage ${page}`}
							</Text>
						</Button>
					})
				}

				<HStack
					as="nav"
					spacing='1.5rem'
				>
					<Text
						fontSize='1.5rem'
						sx={{
							'a:hover': {
								color: 'lightgray'
							}
						}}
					>
						<Link
							href={'/auth/repl'}
						>
							Repl
						</Link>
					</Text>
					<Box>
						{loggedIn && <Logout />}
					</Box>
				</HStack>
			</Flex>
		</chakra.header>
	);
}

export default AdminHeader;