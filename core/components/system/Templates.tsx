import React from 'react';
import { Center } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { TemplatesType } from '@db/models/Templates';
import { TemplatesEnum } from '@db/models/model-types';
import TemplateMap from '@core/components/client-templates/TemplateMap';
import { AllDocType } from '../types/util_types';

const Templates = ({ templates, width }: { templates: TemplatesType[], width?: any }) => {
	if (!process.env.NEXT_PUBLIC_SITE_FOLDER) {
		throw new Error('No NEXT_PUBLIC_SITE_FOLDER env var declared, should match the key defined in TemplateMap')
	}
	const searchParams = useSearchParams();
	const mappedComps = templates
		?.filter(temp => temp?.showMobile)
		.map(temp => {
			let C = TemplateMap[process.env.NEXT_PUBLIC_SITE_FOLDER as string][temp.type as keyof typeof TemplatesEnum];
			let props = { template: temp, searchParams };
			return <C key={temp._id} {...props} />
		})

	return (
		<Center
			maxW='2000px'
			height='100%'
			m='0 auto'
			flexDir='column'
			w={width ?? { base: '100%', md: '80%' }}
		>
			{mappedComps}
		</Center>
	)
}

export default Templates;