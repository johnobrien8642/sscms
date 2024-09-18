import React from 'react';
import { 
	Card, 
	CardHeader, 
	CardBody, 
	Heading,
	Divider
} from '@chakra-ui/react';
import { BasePropsType } from '@core/components/types/prop_types';

const ContactCard = ({ template }: BasePropsType) => {
	const text = template.textIds[0];
	return <Card
		backgroundColor='var(--chakra-colors-gray-300)'
		boxShadow='1px 1px 1px black'
		color='black'
		my='2rem'
		w={{ base: '100%', md: '75%' }}
	>
		{
			text.title && 
				<>
					<CardHeader>
						<Heading size='lg'>{text.title}</Heading>
					</CardHeader>
					<Divider color='rgb(0,0,0,.5)' w='50%' m='0 auto 0 5%' />
				</>
		}
		<CardBody
			fontSize='1.2rem'
			dangerouslySetInnerHTML={{ __html: text?.richDescription ?? '' }}
		/>
	</Card>
};

export default ContactCard;