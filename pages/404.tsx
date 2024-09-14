import { Center, Heading, Text } from '@chakra-ui/react'
import Link from 'next/link'

export default function Custom404() {
  	return (
		<Center 
			my='5rem'
			flexDir='column'
		>
			<Heading>Whoops! Not Found</Heading>
			<Text>We couldn't find what you were looking for...</Text>
			<Text
				textDecoration='underline'
			>
				<Link href="/">Return Home</Link>
			</Text>
		</Center>
  	)
}