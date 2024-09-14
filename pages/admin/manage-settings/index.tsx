import React, { useEffect, useState } from 'react'
import AdminHeader from '@core/components/system/AdminHeader.tsx';
import { ManagePageFormProvider, dataInitialValue } from '@core/contexts/useManagePageForm.tsx';
import Head from 'next/head';
import { AllDocUnionType } from '@core/components/types/util_types.ts';
import Form from '@core/components/system/Form.tsx';
import { GetServerSideProps, NextPage } from 'next';
import { cloneDeep } from 'lodash';
import { getServerSession } from 'next-auth';
import { authOptions } from '@pages/api/auth/[...nextauth]';

const ManageSettings: NextPage<{}> = () => {
	const [topLevelModal, setTopLevelModal] = useState(false);
	const [formSelected, setFormSelected] = useState({
		loading: false
	});
	const [data, setData] = useState(dataInitialValue);
	const [refetch, setRefetch] = useState(0);
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
				<Form 
					formTitleProp='Settings'
					setRefetch={setRefetch}
					bypassModal 
					revalidateAll 
				/>
			</ManagePageFormProvider>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { req, res } = context;
	const session = await getServerSession(req, res, authOptions);
	if (session) {
		return {
			props: {
				admin: !!session
			}
		};
	} else {
		return {
			redirect: {
				permanent: false,
				destination: "/admin",
			},
			props: {
				admin: !!session
			}
		};
	}
}

export default ManageSettings;
