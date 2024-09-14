import React, { useState, useEffect } from "react";
import {
	Flex,
	HStack,
	chakra,
	Text,
	Box,
	Button,
	useBreakpointValue,
	Link
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Logout from './Logout';
import { useSession } from "next-auth/react";

const AdminHeader = ({ selected }: { selected: string; }) => {
	const { data: session } = useSession();
	const pages = ['Pages', 'Blog', 'Settings'];
	const router = useRouter();
	const desktop = useBreakpointValue(
		{
			base: false,
			md: true
		}
	)

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
						return <Text
								key={page}
								as='h2'
								mr='2%'
								sx={{
									color: selected === page ? 'black' : 'gray',
									':hover': { 
										cursor: 'pointer' 
									} 
								}}
								fontWeight='400'
								fontSize='min(7vw, 1.5rem)'
							>
								<Link
									href={`/admin/manage-${page.toLowerCase()}`}
								>
									{`Manage ${page}`}
								</Link>
						</Text>
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
						{session && <Logout />}
					</Box>
				</HStack>
			</Flex>
		</chakra.header>
	);
}

export default AdminHeader;