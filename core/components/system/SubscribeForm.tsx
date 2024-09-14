import React from 'react';
import Script from 'next/script';

const SubscribeForm = () => {
	return <Script 
		async 
		src={process.env.NEXT_PUBLIC_EO_SRC}
		data-form={process.env.NEXT_PUBLIC_EO_DATA_FORM_ID}
	></Script>
};

export default SubscribeForm;