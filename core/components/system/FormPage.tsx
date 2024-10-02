import React, { useEffect, useState, useCallback } from 'react'
import {
	Button,
	Modal,
	ModalHeader,
	ModalCloseButton,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalFooter,
	Flex,
	Text,
	Heading
} from '@chakra-ui/react'
import Form from './Form.tsx';
import { dataInitialValue, useManagePageForm } from '@core/contexts/useManagePageForm.tsx';
import ListFieldItem from './ListFieldItem.tsx';
import { AllDocUnionType } from '../types/util_types.ts';

import mongoose from 'mongoose';
import { cloneDeep, sortBy } from 'lodash';
import MyPagination from './Pagination.tsx';

const FormPage = ({ 
	formTitle, 
	pageManagerKey,
	paginate,
	formItemOrder,
	pageCount,
	additionalParams
}: { 
	formTitle: string; 
	pageManagerKey: string;
	paginate: boolean;
	formItemOrder?: boolean;
	pageCount?: number;
	additionalParams?: URLSearchParams;
}) => {
	const {
		data,
		setData,
		formSelected,
		setFormSelected,
		setTopLevelModal,
		topLevelModal,
		formCache,
		setFormCache
	} = useManagePageForm();
	const [items, setItems] = useState<AllDocUnionType[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [skip, setSkip] = useState(1);
	const [refetch, setRefetch] = useState(0);
	const limit = 8;

	useEffect(() => {
		setItems([]);
		setTotalItems(0);
		handleGetList();
		async function handleGetList() {
			const params = 
				paginate ? 
					`&skip=${skip === 1 ? 0 : (skip * limit) - limit}&limit=${limit}` : '';
			const res = await fetch(`/api/get_form_items/?formTitle=${formTitle}&formItemOrder=${formItemOrder}${params}&${additionalParams}`,
			{
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				cache: 'no-store'
			})
			const data = await res.json();
			const { items, totalItems } = data;
			setItems(items);
			setTotalItems(totalItems);
		}
	}, [topLevelModal, skip, refetch, additionalParams]);

	useEffect(() => {
		handleUpdateFormOrder();
		async function handleUpdateFormOrder() {
			if (!items?.length) return;
			if (formTitle === 'Page') {
				await fetch(`/api/handle_update_form_order/`,
					{
						method: 'PUT',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							formTitle,
							items
						}),
						cache: 'no-store'
					})
			};
		}
	}, [items]);
	const resolveHeading = useCallback(() => {
		let activeItem = formCache[formCache?.active];
		let previousItem = formCache[activeItem?.previous];
		return `${activeItem?.update? 'Edit ' : 'Create '}${activeItem?.formTitle}${previousItem ? ` for ${previousItem?.formTitle}` : ''}`
	}, [formCache]);
	return (
		<>
			<Button
				m='1rem 2rem'
				onClick={() => {
					setTopLevelModal(true);
					setFormCache((prev: any) => {
						const newData = cloneDeep(prev);
						const newId = new mongoose.Types.ObjectId().toString();
						newData[newId] = {
							...dataInitialValue[formTitle],
							_id: newId,
							formTitle: formTitle,
							schemaName: formTitle,
							update: false
						}
						newData.active = newId;
						setData((prev: any) => {
							const newData2 = cloneDeep(prev);
							newData2[formTitle] = newData[newId];
							return newData2;
						})
						return newData;
					})
				}}
			>
				{`Create New ${formTitle}`}
			</Button>
			{
				!pageCount &&
					formTitle === 'Page' &&
					<Text
						p='3rem'
					>
						To create a home page, click "Create Page", leave the "Title" field blank and "Save".
					</Text>
			}
			<Flex
				flexDir='column'
				justifyContent='space-between'
				maxW='1200px'
				height='100dvh'
			>
				<Flex
					flexDir='column'
				>
					{
						items?.map((obj, index) => {
							return <ListFieldItem
								key={obj._id}
								item={obj}
								noForm={true}
								setItems={setItems}
								index={index}
							/>
						})
					}
				</Flex>
				{paginate && <MyPagination 
					current={skip}
					totalItems={totalItems}
					onChange={setSkip}
					pageSize={limit}
				/>}
			</Flex>
			<Modal
				isOpen={topLevelModal}
				onClose={() => {
					if (!formSelected.loading) {
						setTopLevelModal(false);
						setData(dataInitialValue);
						setFormCache({});
					}
				}}
				size='full'
				scrollBehavior='inside'
			>
				<ModalOverlay />
				<ModalContent
					margin='0'
					rounded='none'
					overflow='hidden'
				>
					<ModalHeader>
						{
							formCache[formCache?.active]?.formTitle && 
								<Heading
									minH='55px'
								>
									{resolveHeading()}
								</Heading>
						}
						<ModalCloseButton 
							onClick={async () => {
								if (
									data[formTitle].schemaName === 'Page' ||
										data[formTitle].schemaName === 'BlogPost'
								) {
									await fetch('/api/handle_draft', {
										method: 'DELETE',
										headers: {
											Accept: 'application/json',
											'Content-Type': 'application/json'
										},
										body: JSON.stringify({
											data: {
												...formCache[formCache.draftId]

											}
										}),
										cache: 'no-store'
									});
								}
								setTopLevelModal(false);
								setData(dataInitialValue);
								setFormCache({});
							}}
						/>
					</ModalHeader>
					<Form 
						formTitleProp={formTitle} 
						pageManagerKey={pageManagerKey}
						setRefetch={setRefetch}
					/>
					<ModalFooter>
						<Button
							colorScheme='blue'
							mr={3}
							onClick={async () => {
								if (
									data[formTitle].schemaName === 'Page' ||
										data[formTitle].schemaName === 'BlogPost'
								) {
									await fetch('/api/handle_draft', {
										method: 'DELETE',
										headers: {
											Accept: 'application/json',
											'Content-Type': 'application/json'
										},
										body: JSON.stringify({
											data: {
												...formCache[formCache.draftId]
											}
										}),
										cache: 'no-store'
									});
								}
								setTopLevelModal(false);
								setData(dataInitialValue);
								setFormCache({});
							}}
						>
							{
								`Cancel ${data[formCache?.[formCache?.active]?.formTitle]?._id ? 'Update' : 'New'} ${formCache?.[formCache?.active]?.formTitle} Form`
							}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}

export default FormPage;
