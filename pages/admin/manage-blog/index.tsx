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
import { cloneDeep, debounce } from 'lodash';
import useLocalStorage from "use-local-storage";
import { DebounceInput } from 'react-debounce-input';

const ManagePages: NextPage<{}> = () => {
	const [topLevelModal, setTopLevelModal] = useState(false);
	const [formSelected, setFormSelected] = useState({
		loading: false
	});
	const [data, setData] = useState(dataInitialValue);
	const [formCache, setFormCache] = useState<any>({});
	const [additionalParams, setAdditionalParams] = useState<URLSearchParams>();
	const [persistBlog, setPersistBlog] = 
		useLocalStorage(
			`${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}-blog-setting`, 
			{ 
				topic: blogPostTopicOptionsEnum[0] as string,
				searchStr: ''
			}
		);
	const [blogPostTopic, setBlogPostTopic] = useState<string>('');
	const [stopDrag, setStopDrag] = useState(false);
	useEffect(() => {
		const paramsObj: any = {};
		paramsObj['topic'] = persistBlog.topic;
		if (persistBlog.searchStr) {
			paramsObj['search'] = persistBlog.searchStr;
		}
		const params = new URLSearchParams(paramsObj);
		setAdditionalParams(params);
	}, [persistBlog]);
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
						onChange={(e: Event | ChangeEvent | FormEvent<HTMLInputElement>) => {
							setPersistBlog(prev => {
								const newData = cloneDeep(prev);
								if (newData?.topic) {
									newData.topic = (e.target as HTMLInputElement).value;
								}
								return newData;
							})
						}}
						value={persistBlog.topic}
						width='fit-content'
					>
						{
							blogPostTopicOptionsEnum.map(str => {
								return <option key={str} value={str}>{str}</option>
							})
						}
					</Select>
					<DebounceInput
						minLength={2}
						debounceTimeout={1000}
						style={{
							padding: '.2rem',
							width: '35%'
						}}
						value={persistBlog.searchStr}
						width='35%'
						placeholder={`Search Blog Posts`}
						onChange={e => {
							setPersistBlog(prev => {
								const newData = cloneDeep(prev);
								if (newData?.searchStr !== undefined) {
									newData.searchStr = (e.target as HTMLInputElement).value;
								}
								return newData;
							})
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
