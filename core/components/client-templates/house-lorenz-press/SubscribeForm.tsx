import React from 'react';
import SubscribeForm from '@core/components/system/SubscribeForm';
import { Divider, Flex, Text } from '@chakra-ui/react';
import { BasePropsType } from '@core/components/types/prop_types';

const HLPSubscribeForm = ({ template }: BasePropsType) => {
	const text = template.textIds[0];
	return <Flex
		flexDir='column'
		justifyContent='center'
		my='1rem'
	>
		<Divider w='50%' m='auto' mb='1rem' />
		{
			text.richDescription && <Text 
				m='auto'
				textAlign='center'
				dangerouslySetInnerHTML={{ __html: text.richDescription }}
				fontSize='1.2rem'
				w='80%'
				as='span'
			/>
		}
		<SubscribeForm />
	</Flex>
}

export default HLPSubscribeForm;

