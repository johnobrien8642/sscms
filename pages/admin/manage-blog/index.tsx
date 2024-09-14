import React, { useEffect, useState, ChangeEvent, FormEvent, } from 'react'
import AdminHeader from '@core/components/system/AdminHeader.tsx';
import { ManagePageFormProvider, dataInitialValue } from '@core/contexts/useManagePageForm.tsx';
import Head from 'next/head';
import FormPage from '@core/components/system/FormPage.tsx';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { Box, Flex, Input, Select, Switch } from '@chakra-ui/react';
import { blogPostTopicOptionsEnum } from '@db/models/model-types';
import { debounce } from 'lodash';

const ManagePages: NextPage<{}> = () => {
	const [topLevelModal, setTopLevelModal] = useState(false);
	const [formSelected, setFormSelected] = useState({
		loading: false
	});
	const [data, setData] = useState(dataInitialValue);
	const [formCache, setFormCache] = useState<any>({});
	const [blogPostTopic, setBlogPostTopic] = useState<string>(blogPostTopicOptionsEnum[0]);
	const [additionalParams, setAdditionalParams] = useState<URLSearchParams>();
	const [search, setSearch] = useState('');
	const [stopDrag, setStopDrag] = useState(false);

	useEffect(() => {
		const paramsObj: any = {};
		paramsObj['topic'] = blogPostTopic;
		if (search) {
			paramsObj['search'] = search;
		}
		const params = new URLSearchParams(paramsObj);
		setAdditionalParams(params);
	}, [blogPostTopic, search]);

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
				<AdminHeader selected='Blog' />
				<Flex
					pt='1rem'
					flexDir='column'
					gap='1rem'
					ml='1rem'
				>
					<Select
						onChange={(e: Event | ChangeEvent | FormEvent<HTMLInputElement>) =>
							setBlogPostTopic((e.target as HTMLInputElement).value)}
						value={blogPostTopic}
						width='fit-content'
					>
						{
							blogPostTopicOptionsEnum.map(str => {
								return <option key={str} value={str}>{str}</option>
							})
						}
					</Select>
					<Input
						value={search}
						width='35%'
						placeholder={`Search Blog Posts`}
						onInput={e => {
							setSearch((e.target as HTMLInputElement).value)
						}}
					/>
				</Flex>
				<FormPage 
					formTitle='BlogPost' 
					pageManagerKey='blogPostIds'
					paginate={true}
					additionalParams={additionalParams}
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

export default ManagePages;
