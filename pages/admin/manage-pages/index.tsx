import React, { useEffect, useState } from 'react'
import { Text } from '@chakra-ui/react';
import AdminHeader from '@core/components/system/AdminHeader.tsx';
import { ManagePageFormProvider, dataInitialValue } from '@core/contexts/useManagePageForm.tsx';
import Head from 'next/head';
import { AllDocUnionType } from '@core/components/types/util_types.ts';
import FormPage from '@core/components/system/FormPage.tsx';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@pages/api/auth/[...nextauth]';
import dbConnect from '@db/lib/mongodb';
import Page from '@db/models/Page';

const ManagePages: NextPage<{}> = ({ pageCount }: { pageCount?: number; }) => {
	const [topLevelModal, setTopLevelModal] = useState(false);
	const [formSelected, setFormSelected] = useState({
		loading: false
	});
	const [data, setData] = useState(dataInitialValue);
	const [formCache, setFormCache] = useState<any>({});
	const [stopDrag, setStopDrag] = useState(false);

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
				stopDrag={stopDrag}
				setStopDrag={setStopDrag}
			>
				<AdminHeader selected='Pages' />
				<FormPage 
					formTitle='Page'
					pageManagerKey='pageIds'
					paginate={false}
					formItemOrder
					pageCount={pageCount}
				/>
			</ManagePageFormProvider>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	await dbConnect();
	const { req, res } = context;
	const session = await getServerSession(req, res, authOptions);
	if (session) {
		const pageCount = await Page.countDocuments();
		return {
			props: {
				admin: !!session,
				pageCount
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

export default ManagePages;
