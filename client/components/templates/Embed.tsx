import React from 'react';
import { Text, Box, Flex, Heading } from '@chakra-ui/react';
import { BasePropsType } from '@core/components/types/prop_types';

const EmbedComp = ({ template }: BasePropsType) => {
	return (
		<Flex
			width={{ base: '90%', md: '75%' }}
			m='auto'
			mt={{ base: '2rem', md: '5rem' }}
			mb={{ base: '2rem', md: '5rem' }}
			fontSize='min(5vw, 2rem)'
			justifyContent='center'
			flexDir='column'
		>
			<Box
				maxW='500px'
				m='auto'
				sx={{
					'button': {
						border: 'solid .2rem white !important'
					}
				}}
			>
				<Text mb='1rem'>Subscribe to get updates when new books are published.</Text>
				<Box
					dangerouslySetInnerHTML={{ __html: `<style>#gumroad-follow-form-embed{margin: 0px; padding: 0px; box-sizing: border-box; min-width: 0px; max-width: 100%; vertical-align: bottom; background-clip: padding-box; scrollbar-color: rgb(0 0 0/0.5) rgb(0 0 0/0.1); display: grid; grid-auto-flow: column; gap: 0.75rem; grid-template-columns: 1fr; grid-auto-columns: max-content; align-items: center;}#gumroad-follow-form-embed-button{margin: 0px; padding: 0px; box-sizing: border-box; min-width: 0px; max-width: 100%; vertical-align: bottom; background-clip: padding-box; scrollbar-color: rgb(0 0 0/0.5) rgb(0 0 0/0.1); background: transparent; font-size: 1rem; line-height: 1.5; padding: 0.75rem 1rem; border: solid .0625rem rgb(0 0 0/1); color: currentcolor; border-radius: 0.25rem; "Mabry Pro", Avenir, Montserrat, Corbel, "URW Gothic", source-sans-pro, sans-serif; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; text-decoration: none; transition-timing-function: ease-out; transition-duration: 0.14s; transition-property: transform;background-color: rgb(0 0 0); color: rgb(255 255 255); }#gumroad-follow-form-embed-button:hover{transform: translate(-0.25rem, -0.25rem); box-shadow: .25rem .25rem 0rem rgb(0 0 0);background-color: rgb(255 144 232); color: rgb(0 0 0); }#gumroad-follow-form-embed-input{margin: 0px; padding: 0px; box-sizing: border-box; min-width: 0px; max-width: 100%; vertical-align: bottom; background-clip: padding-box; scrollbar-color: rgb(0 0 0/0.5) rgb(0 0 0/0.1); "Mabry Pro", Avenir, Montserrat, Corbel, "URW Gothic", source-sans-pro, sans-serif; padding: 0.75rem 1rem; font-size: 1rem; line-height: 1.5; border: solid .0625rem rgb(0 0 0/1); border-radius: 0.25rem; display: block; width: 100%; background-color: rgb(255 255 255); color: rgb(0 0 0); }#gumroad-follow-form-embed-input:disabled{cursor: not-allowed; opacity: 0.3;}#gumroad-follow-form-embed-input::placeholder{color: rgb(0 0 0/0.5);}#gumroad-follow-form-embed-input:focus-within{outline: .125rem solid rgb(255 144 232);}#gumroad-follow-form-embed-input:read-only{background-color: #f4f4f0;}</style><form class="input-with-button" action="https://app.gumroad.com/follow_from_embed_form" method="post" id="gumroad-follow-form-embed"><input type="hidden" name="seller_id" value="3375178553655"/><input id="gumroad-follow-form-embed-input" type="email" placeholder="Your email address" name="email" value=""/><button id="gumroad-follow-form-embed-button" class="primary" type="submit">Subscribe</button></form>` }}
				/>
			</Box>
		</Flex>
	)
}

export default EmbedComp;