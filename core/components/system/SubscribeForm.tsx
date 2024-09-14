import { Center, Box, Text } from '@chakra-ui/react';
import React from 'react';
import Script from 'next/script';

const SubscribeForm = ({
	src,
	dataForm
}: {
	src: string;
	dataForm: string;
}) => {
	return <Script 
		async 
		src={src}
		data-form={dataForm}
	></Script>
};

export default SubscribeForm;