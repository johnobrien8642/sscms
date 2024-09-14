import React, { useEffect, useState, useRef } from 'react';
import ListFieldItem from './ListFieldItem';
import {
	Box,
	Button,
	Flex,
	ButtonGroup,
	Input,
	Text,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	Spinner
} from '@chakra-ui/react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { dataInitialValue, useManagePageForm } from '@core/contexts/useManagePageForm';
import { assetsEnumValueArr, templatesEnumValueArr } from '@db/models/model-types';
import { OptionsType } from '@db/models/model-types';
import { AllDocUnionType } from '../types/util_types';
import { cloneDeep, uniqBy } from 'lodash';
import mongoose from 'mongoose';

const ListField = ({
		obj,
		title,
		singleChoice
	}: {
		obj: { 
			$embeddedSchemaType: { options: { ref: string; } };
			options: OptionsType & { ref?: string; }; 
			caster?: { path?: string; options: OptionsType & { ref?: string; } }; 
			instance: string; 
		};
		title: string;
		singleChoice: boolean | undefined;
	}) => {
	const [availableItems, setAvailableItems] = useState<AllDocUnionType[]>([]);
	const [chosenItems, setChosenItems] = useState<AllDocUnionType[]>([]);
	const [itemFilter, setItemFilter] = useState('');
	const limitNum = 10;
	const [skip, setSkip] = useState(0);
	const [hasMoreAvailableCount, setHasMoreAvailableCount] = useState(0);
	const [searchAvailable, setSearchAvailable] = useState(false);
	const [itemFilterArr, setItemFilterArr] =
		useState<typeof templatesEnumValueArr | typeof assetsEnumValueArr | null>([]);
	const [textFilter, setTextFilter] = useState('');
	const { formSelected, setFormSelected, data, setData, setFormCache, formCache } = useManagePageForm();
	const formTitle = formCache[formCache.active]?.formTitle ?? '';

	useEffect(() => {
		let itemFilterArr;
		if (obj.options.filterType) {
			itemFilterArr = obj.caster?.path === 'templatesIds' ? templatesEnumValueArr : assetsEnumValueArr;
		} else {
			itemFilterArr = null;
		}
		setItemFilterArr(itemFilterArr)
		setItemFilter(itemFilterArr?.[0] ?? '')
	}, [formCache])
	
	useEffect(() => {
		handleGetList();
		async function handleGetList() {
			const paramsObj: { 
				schema: string; 
				nestedItemIds?: string; 
				itemType?: string;
				skipAvailableItems?: string;
				skip: string;
				limit: string;
			} = { 
				schema: obj.caster?.options?.ref ?? obj.options?.ref ?? '', 
				skip: skip.toString(),
				limit: limitNum.toString()
			};
			if (data?.[formTitle]?.[title]) {
				paramsObj['nestedItemIds'] =
					data?.[formTitle]?.[title].map((obj: any) => {
						if (typeof obj === 'object') {
							return obj._id
						} else {
							return obj
						}
					});
			}
			if (
				obj.$embeddedSchemaType.options.ref === 'Templates' ||
					obj.$embeddedSchemaType.options.ref === 'Text'
			) {
				paramsObj['skipAvailableItems'] = 'true';
			}
			if (itemFilter) {
				paramsObj['itemType'] = itemFilter;
			}
			paramsObj['skip'] = skip.toString();
			paramsObj['limit'] = limitNum.toString();
			const params = new URLSearchParams(paramsObj);
			const res = await fetch(`/api/get_list_field_items?${params}`, { cache: 'no-store' });
			const resData = await res.json();
			const { fetchedAvailableItems, fetchedChosenItems, availableItemsCount } = resData;
			setChosenItems(fetchedChosenItems);
			setAvailableItems(uniqBy([...availableItems, ...fetchedAvailableItems], '_id'));
			setHasMoreAvailableCount(availableItemsCount);
		}
	}, [itemFilter, formCache, skip]);
	
	if (obj.options.onlyAllowUpdateActive && formCache.insideDraftsModal) {
		return <Text opacity='.5'>Can only update active version</Text>
	} else {
		return (
			<Flex
				flexDir='column'
			>
				{singleChoice &&
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
				{!singleChoice &&
					<Box
						outline='black solid .1rem'
						borderRadius='.2rem'
						height={obj.options.xlWindow ? '420px' : '220px'}
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
				}
				<Button
					width='fit-content'
					onClick={() => {
						setFormCache((prev: any) => {
							const newFormCacheData = cloneDeep(prev);
							const newId = new mongoose.Types.ObjectId().toString();
							newFormCacheData[newId] = {
								...dataInitialValue[obj.caster?.options?.ref ?? ''],
								_id: newId,
								previous: data[formTitle]._id,
								schemaName: obj.caster?.options?.ref,
								formTitle: obj.caster?.options.ref,
								parentFieldTitle: title,
								update: false,
							}
							newFormCacheData.active = newId;
							newFormCacheData[data[formTitle]._id.toString()] = {
								...data[formTitle],
								next: newId
							}
							setData(prev => {
								const newData = cloneDeep(prev);
								newData[obj.caster?.options?.ref ?? ''] = newFormCacheData[newId];
								return newData;
							})
							return newFormCacheData;
						})
					}}
				>
					Create New {obj.caster?.options?.ref ?? obj.options?.ref}
				</Button>
				{obj.$embeddedSchemaType.options.ref !== 'Templates' &&
					obj.$embeddedSchemaType.options.ref !== 'Text' && 
					<Accordion allowToggle my='1rem'>
						<AccordionItem>
							<AccordionButton
								// backgroundColor={inUse && formTitle !== 'Page' ? 'var(--chakra-colors-blue-100)' : ''}
							>
								Choose
							<AccordionIcon />
							</AccordionButton>
							<AccordionPanel>
								<>
									<ButtonGroup gap='1' mt='1rem' flexWrap='wrap'>
										{
											itemFilterArr?.map(str => {
												return <Button
													key={str}
													variant={str === itemFilter ? 'ghost' : 'outline'}
													onClick={() => {
														setItemFilter(str);
														setAvailableItems([]);
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
										height='220px'
										overflow='auto'
										my='1rem'
										padding='.5rem'
									>
										<InfiniteScroll
											dataLength={availableItems.length}
											next={() => {
												setSkip(availableItems.length)
											}}
											hasMore={true}
											loader={<Spinner />}
										>
											{
												availableItems
													?.filter(item => {
														const regexp: RegExp = new RegExp(textFilter, 'i')
														return (item as any).title?.match(regexp) ||
															(item as any).description?.match(regexp) ||
															(item as any).richDescription?.match(regexp)
													})
													?.map((item, index) => {
														return <ListFieldItem
															key={item._id + title}
															item={item}
															title={title}
															index={index}
															chosen='false'
															setAvailableItems={setAvailableItems}
															setChosenItems={setChosenItems}
															singleChoice={singleChoice}
														/>
													})
											}

										</InfiniteScroll>
										{
											!availableItems?.length && 'No items to choose'
										}
									</Box>
								</>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
				}
			</Flex>
		)
	}
}

export default ListField;