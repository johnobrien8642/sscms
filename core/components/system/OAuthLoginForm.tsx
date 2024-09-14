import { Center, Flex, Box, Heading, Text } from "@chakra-ui/react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import GoogleButton from 'react-google-button'
import { SettingsType } from "@db/models/Settings"

export default function OAuthLoginForm({ settings }: { settings: string; }) {
	const pSettings: SettingsType = JSON.parse(settings);
	const { data: session } = useSession();
	const router = useRouter();
	useEffect(() => {
		if (session) {
			router.push('/admin/manage-pages');
		}
	}, [])
	return (
		<Center
			flexDirection={'column'}
			p='3rem'
		>
			<Center
				flexDir='column'
				mt='5rem'
				mb='2rem'
			>
				<Heading
					mb='.5rem'
				>
					{pSettings?.siteTitle} CMS
				</Heading>
				<Text
					sx={{
						'a': {
							textDecor: 'underline'
						}
					}}
				>
					Powered by <a href="https://github.com/johnobrien8642/sscms">SSCMS</a>
				</Text>
			</Center>
			<GoogleButton 
				onClick={() => {
					signIn();
				}}
			/>
		</Center>
	)
}
