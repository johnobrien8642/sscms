import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

const SubscribeForm = () => {
	const subscribeDivEl = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const script = document.createElement('script');
		script.async = true;
		script.src = process.env.NEXT_PUBLIC_EO_SRC ?? '';
		script.setAttribute('data-form', process.env.NEXT_PUBLIC_EO_DATA_FORM_ID ?? '');
		if (subscribeDivEl) {
			subscribeDivEl.current?.append(script);
		}
	}, []);
	return <Box ref={subscribeDivEl} />
};

export default SubscribeForm;