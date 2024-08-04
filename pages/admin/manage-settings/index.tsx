import React, { useEffect, useState } from 'react'
import connectDb from '@db/lib/mongodb.js';
import Admin from '@db/models/Admin.ts';
import jwt from 'jsonwebtoken';
import AdminHeader from '@core/components/system/AdminHeader.tsx';
import { useRouter } from 'next/router';
import { ManagePageFormProvider, dataInitialValue } from '@core/contexts/useManagePageForm.tsx';
import Head from 'next/head';
import { AllDocUnionType } from '@core/components/types/util_types.ts';
import Form from '@core/components/system/Form.tsx';
import { GetServerSideProps, NextPage } from 'next';
import { cloneDeep } from 'lodash';

const ManageSettings: NextPage<{}> = () => {
	const [topLevelModal, setTopLevelModal] = useState(false);
	const [formSelected, setFormSelected] = useState({
		loading: false
	});
	const [data, setData] = useState(dataInitialValue);
	const [formCache, setFormCache] = useState<any>({});

	useEffect(() => {
		handleGetSettings();
		async function handleGetSettings() {
			const res = await fetch(`/api/get_settings/`,
			{
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				cache: 'no-store'
			})
			const data = await res.json();
			const { item } = data;
			setFormCache((prev: any) => {
				const newData = cloneDeep(prev);
				newData[item._id] = {
					...item,
					formTitle: item.schemaName,
					update: true
				}
				newData.active = item._id;
				setData(prev => {
					const newData2 = cloneDeep(prev);
					newData2[item.schemaName ?? ''] = newData[item._id];
					return newData2;
				})
				return newData;
			})
		}
	}, []);

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
				<AdminHeader selected='Settings' />
				<Form formType='Settings' bypassModal />
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

export default ManageSettings;
