import React, { useEffect, useState } from 'react'
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
} from '@chakra-ui/react'
import Form from './Form.tsx';
import { useRouter } from 'next/router';
import { dataInitialValue, useManagePageForm } from '../../contexts/useManagePageForm.tsx';
import ListFieldItem from './ListFieldItem.tsx';
import { AllDocUnionType } from '../types/util_types.ts';

import mongoose from 'mongoose';
import { cloneDeep } from 'lodash';

const FormPage = ({ 
	formType, 
	pageManagerKey
}: { 
	formType: string; 
	pageManagerKey: string;
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

	useEffect(() => {
		handleGetList();
		async function handleGetList() {
			const res = await fetch(`/api/handle_page_manager/?pageManagerKey=${pageManagerKey}&query=1`,
			{
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				cache: 'no-store'
			})
			const data = await res.json();
			const { pageManager } = data;
			setItems(pageManager[pageManagerKey]);
		}
	}, [topLevelModal]);

	useEffect(() => {
		handleGetList();
		async function handleGetList() {
			if (!items.length) return;
			const res = await fetch(`/api/handle_page_manager/?pageManagerKey=${pageManagerKey}&query=2`,
			{
				method: 'PUT',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					items: items.map(obj => obj._id)
				}),
				cache: 'no-store'
			})
		}
	}, [items]);

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
							...dataInitialValue[formType],
							_id: newId,
							formTitle: formType,
							update: false
						}
						newData.active = newId;
						setData((prev: any) => {
							const newData2 = cloneDeep(prev);
							newData2[formType] = newData[newId];
							return newData2;
						})
						return newData;
					})
				}}
			>
				{`Create New ${formType}`}
			</Button>
			<Flex
				flexDir='column'
				maxW='1200px'
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
			<Modal
				isOpen={topLevelModal}
				onClose={() => {
					if (!formSelected.loading) {
						setTopLevelModal(false);
						setData(dataInitialValue);
						setFormCache({});
					}
				}}
			>
				<ModalOverlay />
				<ModalContent maxW='1200px' position='relative'>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Form formType={formType} pageManagerKey={pageManagerKey} />
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme='blue'
							mr={3}
							onClick={() => {
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
