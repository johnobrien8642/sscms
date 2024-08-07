import React, { useEffect, useState } from 'react'
import connectDb from '@db/lib/mongodb.js';
import Admin from '@db/models/Admin.ts';
import jwt from 'jsonwebtoken';
import AdminHeader from '@core/components/system/AdminHeader.tsx';
import { useRouter } from 'next/router';
import { ManagePageFormProvider, dataInitialValue } from '@core/contexts/useManagePageForm.tsx';
import Head from 'next/head';
import { AllDocUnionType } from '@core/components/types/util_types.ts';
import FormPage from '@core/components/system/FormPage.tsx';
import { GetServerSideProps, NextPage } from 'next';

const ManagePages: NextPage<{}> = () => {
	const [topLevelModal, setTopLevelModal] = useState(false);
	const [formSelected, setFormSelected] = useState({
		loading: false
	});
	const [data, setData] = useState(dataInitialValue);
	const [formCache, setFormCache] = useState<any>({});

	return (
		<>
			<Head>
				<link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon" />
			</Head>
			<ManagePageFormProvider
				data={data}
				setData={setData}
				formCache={formCache}
				setFormCache={setFormCache}
				formSelected={formSelected}
				setFormSelected={setFormSelected}
				setTopLevelModal={setTopLevelModal}
				topLevelModal={topLevelModal}
			>
				<AdminHeader selected='Pages' />
				<FormPage 
					formType='Page' 
					pageManagerKey='pageIds'
				/>
			</ManagePageFormProvider>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	await connectDb();
	let decoded;
	let token = context.req.cookies[process.env.NEXT_PUBLIC_LOGGED_IN_VAR as string];
	if (token) {
		decoded = jwt.verify(
			token,
			process.env.NEXT_PUBLIC_SECRET_KEY as string
		) as { id?: string; };
	}
	const authenticated = await Admin.findById(decoded?.id);
	if (authenticated) {
		return {
			props: {
				admin: !!authenticated
			}
		};
	} else {
		return {
			redirect: {
				permanent: false,
				destination: "/admin",
			},
			props: {
				admin: !!authenticated
			}
		};
	}
}

export default ManagePages;
