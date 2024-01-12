import React, { useEffect, useState } from 'react';
import ListFieldItem from './ListFieldItem';
import {
	Box,
	Button,
	Flex,
	ButtonGroup,
	Input
} from '@chakra-ui/react'
import { useManagePageForm } from '../../contexts/useManagePageForm';
import { assetsEnumValueArr, templatesEnumValueArr } from '../../../models/model-types';
import { OptionsType } from '../../../models/model-types';
import { AllDocUnionType } from '../types/util_types';

const ListField = ({
		obj,
		title,
		singleChoice
	}: {
		obj: { options: OptionsType & { ref?: string; }; caster?: { options: OptionsType & { ref?: string; } }; instance: string; };
		title: string;
		singleChoice: boolean | undefined;
	}) => {
	const [availableItems, setAvailableItems] = useState<AllDocUnionType[]>([]);
	const [chosenItems, setChosenItems] = useState<AllDocUnionType[]>([]);
	const [itemFilter, setItemFilter] = useState('');
	const [itemFilterArr, setItemFilterArr] =
		useState<typeof templatesEnumValueArr | typeof assetsEnumValueArr>([]);
	const [textFilter, setTextFilter] = useState('');
	const { formSelected, setFormSelected, data } = useManagePageForm();
	const { formTitle } = formSelected;

	useEffect(() => {
		const itemFilterArr = formTitle === 'Page' ? templatesEnumValueArr : assetsEnumValueArr;
		setItemFilterArr(itemFilterArr)
		setItemFilter(itemFilterArr[0])
	}, [])

	useEffect(() => {
		handleGetList();
		async function handleGetList() {
			const paramsObj: { schema: string; nestedItemIds?: string; itemType?: string; } =
				{ schema: obj.caster?.options?.ref ?? obj.options?.ref ?? '' };
			if (data?.[formTitle]?.[title]) {
				paramsObj['nestedItemIds'] = data?.[formTitle]?.[title];
			}
			if (itemFilter) {
				paramsObj['itemType'] = itemFilter;
			}
			const params = new URLSearchParams(paramsObj);
			if (itemFilter) {
				const res = await fetch(`/api/get_list_field_items?${params}`);
				const resData = await res.json();
				const { availableItems, chosenItems } = resData;
				setAvailableItems(availableItems);
				setChosenItems(chosenItems);
			}
		}
	}, [itemFilter]);

	return (
		<Flex
			flexDir='column'
		>
			<Box
				outline='black solid .1rem'
				borderRadius='.2rem'
				height={singleChoice ? '100px' : '600px'}
				overflow='auto'
				my='1rem'
				padding='.5rem'
			>
				{
					chosenItems?.map((item, index) => {
						return <ListFieldItem
							key={item._id}
							item={item}
							title={title}
							chosen='true'
							index={index}
							setChosenItems={setChosenItems}
							setAvailableItems={setAvailableItems}
							chosenItems={chosenItems}
							singleChoice={singleChoice}
						/>
					})
				}
				{
					!chosenItems?.length && 'No items chosen'
				}
			</Box>
			<Button
				width='fit-content'
				onClick={() => {
					setFormSelected(prev => {
						return {
							...prev,
							formTitle: obj.caster?.options.ref ?? '',
							prevFormTitle: prev.formTitle
						}
					})
				}}
			>
				Create New {obj.caster?.options?.ref ?? obj.options?.ref}
			</Button>
			<ButtonGroup gap='1' mt='1rem' flexWrap='wrap'>
				{
					itemFilterArr.map(str => {
						return <Button
							key={str}
							variant={str === itemFilter ? 'ghost' : 'outline'}
							onClick={() => {
								setItemFilter(str)
							}}
						>
							{str}
						</Button>
					})
				}
			</ButtonGroup>
			<Box
				pt='1rem'
			>
				<Input
					value={textFilter}
					width='35%'
					placeholder={`Search ${obj.caster?.options?.ref ?? obj.options?.ref}`}
					onInput={e => {
						setTextFilter((e.target as HTMLInputElement).value)
					}}
				/>
			</Box>
			<Box
				outline='black solid .1rem'
				borderRadius='.2rem'
				height='600px'
				overflow='auto'
				my='1rem'
				padding='.5rem'
			>
				{
					availableItems
						?.filter(item => {
							const regexp: RegExp = new RegExp(textFilter, 'i')
							return (item as any).title?.match(regexp) ||
								(item as any).description?.match(regexp) ||
								(item as any).richDescription?.match(regexp)
						})
						?.map(item => {
							return <ListFieldItem
								key={item._id}
								item={item}
								title={title}
								chosen='false'
								setAvailableItems={setAvailableItems}
								setChosenItems={setChosenItems}
								singleChoice={singleChoice}
							/>
						})
				}
				{
					!availableItems?.length && 'No items to choose'
				}
			</Box>
		</Flex>
	)
}

export default ListField;