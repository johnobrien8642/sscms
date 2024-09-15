import React, { SetStateAction, useState } from 'react';
import Image from 'next/image';
import {
	Text,
	IconButton,
	Center,
	Box,
	Flex,
	Modal,
	ModalHeader,
	ModalCloseButton,
	ModalOverlay,
	ModalContent,
	ModalBody,
	Button,
	Tooltip,
	Spinner
} from '@chakra-ui/react';
import { set, truncate } from 'lodash';
import { useManagePageForm } from '@core/contexts/useManagePageForm';
import { EditIcon, AddIcon, MinusIcon, RepeatIcon, DeleteIcon } from '@chakra-ui/icons';
import { remove, cloneDeep } from 'lodash';
import { useDrag, useDrop } from 'react-dnd';
// @ts-expect-error there's no types for lodash-move it's old af
import move from 'lodash-move';
import { AllDocUnionType, AllDocType, AllDocArrayType } from '../types/util_types';
import { OptionsType } from '@db/models/model-types';
import dateFormat from 'dateformat';
import DraftsMenu from './DraftsMenu';

const ListFieldItem = ({
	item,
	chosen,
	title,
	index,
	noForm,
	setItems,
	setChosenItems,
	setAvailableItems,
	singleChoice,
	insideDraftsModal,
}: {
	item: AllDocUnionType;
	index: number;
	title?: string;
	chosen?: string;
	singleChoice?: boolean | undefined;
	setItems?: React.Dispatch<SetStateAction<AllDocUnionType[]>>;
	setChosenItems?: React.Dispatch<SetStateAction<AllDocUnionType[]>>;
	setAvailableItems?: React.Dispatch<SetStateAction<AllDocUnionType[]>>;
	chosenItems?: AllDocUnionType[];
	noForm?: boolean;
	insideDraftsModal?: boolean;
}) => {
	const { 
		data, 
		setData, 
		formSelected, 
		setFormSelected, 
		setTopLevelModal, 
		formCache, 
		setFormCache,
		stopDrag,
		setStopDrag
	} = useManagePageForm();
	const formTitle = formCache[formCache.active]?.formTitle ?? '';
	const [openModal, setOpenModal] = useState(false);
	const [error, setError] = useState('');
	const styleProps = {
		as: 'span',
		mx: '1rem',
		textAlign: 'center',
		fontSize: '.9rem'
	}
	//@ts-ignore 
	item.typeName = item.schemaName;
	const [{ isOver }, drop] = useDrop(() => ({
		accept: 'ListFieldItem',
		drop: (item: { index: number; } & AllDocType) => {
			if (noForm) {
				if (setItems) {
					setItems(prev => {
						const newData = cloneDeep(prev);
						return move(newData, item.index, index);
					})
				}
			} else {
				if (setChosenItems) {
					setChosenItems(prev => {
						let newData = cloneDeep(prev);
						newData = move(newData, item.index, index);
						return newData;
					})
				}
				if (title) {
					setData(prev => {
						const newData = cloneDeep(prev);
						newData[formTitle][title] = move(newData[formTitle][title], item.index, index);
						return newData;
					})
				}
			}
		},
		collect: (monitor) => ({
			isOver: monitor.isOver()
		}),
	}));
	// @ts-expect-error object is throwing error, typing not needed
	const [{}, drag] = useDrag(() => ({
		type: 'ListFieldItem',
		item: {
			...item,
			index
		},
		canDrag: function(props) {
			if (stopDrag) {
				return false
			} else {
				return !!insideDraftsModal ? false : true
			}
		}
	}), [stopDrag]);
	function handleListFieldItemContent() {
		return (
			<>
				{item.typeName === 'Page' && <Text sx={{...styleProps}}>{item?.folderHref ?? ''}</Text>}
				<Text sx={{...styleProps}}>{truncate(item?.title ?? '', { length: 50 })}</Text>
				{
					(item.typeName === 'Page' || 
						item.typeName === 'BlogPost') && 
							!insideDraftsModal &&
						<DraftsMenu
							formTitle={item.schemaName ?? ''}
							draftsKey='folderHref'
							draftsValue={item.folderHref ?? ''}
						/>
				}
				{
					item.typeName === 'Page' && 
						item.isActiveDraft && 
							insideDraftsModal &&
						<Text color='green'>Active</Text>
				}
				{
					item.typeName !== 'BlogPost' && 
						item.typeName !== 'Text' && 
					<Tooltip
						label={item?.description}
						openDelay={500}
					>
						<Text sx={{...styleProps}}>{truncate(item?.description ?? '', { length: 50 })}</Text>
					</Tooltip>
				}
				{
					(item.typeName === 'Assets' ||
						item.typeName === 'Templates' ||
							item.typeName === 'Text') &&
						<Tooltip
							label={item?.richDescription}
							openDelay={500}
						>
							<Text
								whiteSpace='nowrap'
								overflow='hidden'
								textOverflow='ellipsis'
								maxWidth='10rem'
								display='block'
								sx={{
									...styleProps,
									'p': {
										marginBottom: '0'
									}
								}}
								dangerouslySetInnerHTML={{ __html: truncate(item?.richDescription ?? '', { length: 50 })}}
							/>
						</Tooltip>
				}
				{
					(item.typeName === 'Assets' ||
						item.typeName === 'Templates') &&
						<Text sx={{...styleProps}}>{item?.type}</Text>
				}
				{
					(item.typeName === 'BlogPost' ||
						item.typeName === 'Page') &&
						<Text sx={{...styleProps}}>{dateFormat(new Date(item?.createdAt), 'default')}</Text>
				}
				{
					(item.typeName === 'BlogPost' ||
						item.typeName === 'Page') &&
						<Text sx={{...styleProps}} color={item.isPublished ? 'green' : 'red'}>{item.isPublished ? 'Published' : 'Unpublished'}</Text>
				}
				{
					(
					item.typeName === 'Assets'
					) && item?.assetKey &&
							item?.type === 'Image' &&
							<Box
								mx='1rem'
								// width='100'
								height='100%'
							>
								<Image
									width='100'
									height='100'
									alt={item?.title ?? 'alt'}
									src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + item.assetKey}
								/>
							</Box>
				}
				{
					item.typeName === 'Assets'&&
					item?.thumbnailKey &&
					item?.type === 'Image' &&
					<Box
					mx='1rem'
					width='100'
					height='100%'
					>
							<Image
								width='100'
								height='100'
								alt={item?.title ?? 'alt'}
								src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + item.thumbnailKey}
								/>
						</Box>
				}
				{
					(item.typeName === 'BlogPost') && 
						!!item?.mainImage?.length &&
							<Box
								mx='1rem'
								width='100'
								height='100%'
							>
								<Image
									width='100'
									height='100'
									alt={item?.title ?? 'alt'}
									src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL as string + item.mainImage[0].assetKey}
								/>
							</Box>
				}
			</>
		)
	}
	
	return (
		<>
			<Box
				key={item._id.toString()}
				//@ts-ignore
				ref={drop}
			>
				<Flex
					justifyContent='space-between'
					border='black solid .1rem'
					borderRadius='.5rem'
					m='1rem'
					alignItems='center'
					padding='.5rem'
					//@ts-ignore
					ref={drag}
				>
					{handleListFieldItemContent()}
					<Flex>
						{
							chosen && chosen === 'true' &&
								<IconButton
									onClick={() => {
										if (setAvailableItems) {
											setAvailableItems(prev => {
												let newData = cloneDeep(prev);
												newData = [...newData, item] as AllDocUnionType[];
												return newData;
											})
										}
										if (setChosenItems) {
											setChosenItems(prev => {
												let newData = cloneDeep(prev);
												if (singleChoice) {
													newData = [] as unknown as AllDocUnionType[];
												} else {
													remove(newData, (arrItem) => {
														return arrItem._id === item._id
													});
												}
												return newData;
											})
										}
										setData(prev => {
											const newData = cloneDeep(prev);
											if (singleChoice && title) {
												newData[formTitle][title] = [];
											} else if (!singleChoice && title) {
												remove(newData[formTitle]?.[title], (id) => {
													return id === item._id
												});
											}
											return newData;
										})
									}}
									icon={<MinusIcon />}
									mr='.3rem'
									aria-label='Minus Button'
								/>
						}
						{
							chosen && chosen === 'false' &&
								<IconButton
									onClick={() => {
										if (setChosenItems) {
											setChosenItems(prev => {
												let newData = cloneDeep(prev);
												newData = [...newData, item] as AllDocArrayType;
												return newData;
											})
										}
										if (setAvailableItems) {
											setAvailableItems(prev => {
												let newData = cloneDeep(prev);
												remove(newData, (arrItem) => {
													return arrItem._id === item._id
												});
												return newData;
											})
										}
										setData(prev => {
											const newData = cloneDeep(prev);
											if (singleChoice && title) {
												newData[formTitle][title] = [item._id];
											} else if (!singleChoice && title) {
												if (newData[formTitle]?.[title]) {
													newData[formTitle]?.[title].push(item._id);
												} else {
													set(newData, `${formTitle}.${title}`, [item._id]);
												}
											}
											return newData;
										})
									}}
									icon={<AddIcon />}
									mr='.3rem'
									aria-label='Add Button'
								/>
						}
						<IconButton
							onClick={async (e) => {
								setTopLevelModal(true);
								setFormSelected(prev => {
									const newData = cloneDeep(prev);
									newData.loading = true;
									return newData;
								});
								if (
									item.typeName === 'Page' || 
										item.typeName === 'BlogPost'
								) {
									const res = await fetch('/api/handle_draft', {
										method: 'POST',
										headers: {
											Accept: 'application/json',
											'Content-Type': 'application/json'
										},
										body: JSON.stringify({
											data: {
												...item
											}
										}),
										cache: 'no-store'
									});
									if (res?.ok) {
										const { draft } = await res.json();
										setFormCache((prev: any) => {
											const newData = cloneDeep(prev);
											newData[draft._id] = {
												...draft,
												previous: data[formTitle]?._id,
												formTitle: draft.schemaName,
												update: true,
												parentFieldTitle: title,
												draftForId: item._id,
												activeBeingDrafted: item.isActiveDraft,
												publishedBeingEdited: item.isPublished
											}
											newData.active = draft._id;
											newData.insideDraftsModal = !!insideDraftsModal;
											if (
												draft.schemaName === 'Page' ||
												draft.schemaName === 'BlogPost'
											) {
												newData.draftId = draft._id;
											}
											if (data[formTitle]?._id) {
												newData[data[formTitle]._id.toString()] = {
													...data[formTitle],
													next: draft._id,
												}
											}
											setData(prev => {
												const newData2 = cloneDeep(prev);
												newData2[draft.schemaName ?? ''] = newData[draft._id];
												return newData2;
											})
											return newData;
										})
									} else {
										setError('Drafting errored');
									}
								} else {
									setFormCache((prev: any) => {
										const newData = cloneDeep(prev);
										newData[item._id] = {
											...item,
											previous: data[formTitle]?._id,
											formTitle: item.schemaName,
											update: true,
											parentFieldTitle: title
										}
										newData.active = item._id;
										newData.insideDraftsModal = !!insideDraftsModal;
										if (
											item.schemaName === 'Page' ||
											item.schemaName === 'BlogPost'
										) {
											newData.draftId = item._id;
										}
										if (data[formTitle]?._id) {
											newData[data[formTitle]._id.toString()] = {
												...data[formTitle],
												next: item._id,
											}
										}
										setData(prev => {
											const newData2 = cloneDeep(prev);
											newData2[item.schemaName ?? ''] = newData[item._id];
											return newData2;
										})
										return newData;
									})
								}
								setFormSelected(prev => {
									const newData = cloneDeep(prev);
									newData.loading = false;
									return newData;
								});
							}}
							icon={<EditIcon />}
							mr='.3rem'
							aria-label='Edit Button'
						/>
						{item.schemaName === 'Assets' &&
								<IconButton
									onClick={async () => {
										let itemRef = { ...item };
										//@ts-ignore
										delete itemRef._id;
										const res3 = await fetch('/api/handle_duplicate_item/',
										{
											method: 'POST',
											headers: {
												Accept: 'application/json',
												'Content-Type': 'application/json'
											},
											body: JSON.stringify({
												item: itemRef,
												schema: item.schemaName
											}),
											cache: 'no-store'
										})
										const data2 = await res3.json();
										const { savedNewItem } = data2;
										if (chosen === 'true') {
											if (setChosenItems) {
												setChosenItems(prev => {
													const newData = cloneDeep(prev);
													newData.splice(index + 1, 0, savedNewItem);
													return newData;
												})
											}
											setData(prev => {
												const newData = cloneDeep(prev);
												if (title) {
													newData[formTitle][title].splice(index + 1, 0, savedNewItem);
												}
												return newData;
											})
										} else {
											if (setAvailableItems) {
												setAvailableItems(prev => {
													const newData = cloneDeep(prev);
													newData.splice(index + 1, 0, savedNewItem);
													return newData;
												})
											}
										}
									}}
									icon={<RepeatIcon />}
									mr='.3rem'
									aria-label='Duplicate Button'
								/>
						}
						<IconButton
							onClick={() => {
								setOpenModal(true)
							}}
							icon={<DeleteIcon />}
							aria-label='Delete Button'
						/>
					</Flex>
					<Modal
						isOpen={openModal}
						onClose={() => {
							setOpenModal(false);
						}}
					>
						<ModalOverlay />
						<ModalContent position='relative' maxW='800px'>
							<ModalHeader>Delete {item.schemaName}</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<Flex
									flexDir='column'
									my='1rem'
								>
									<Flex
										mx='auto'
										my='1rem'
									>
										{handleListFieldItemContent()}
									</Flex>
									{formSelected.loading && <Spinner size='xl' />}
									{
										error &&
											<Text
												color='red'
												my='1rem'
											>

												{`Something went wrong: ${error}`}
											</Text>
									}
									<Center>
										<Button
											colorScheme='blue'
											mr={3}
											isDisabled={formSelected.loading}
											onClick={async () => {
												setFormSelected(prev => {
													const newData = cloneDeep(prev);
													newData.loading = true;
													return newData;
												});
												const res = await fetch(`/api/get_model_schema?formTitle=${item.schemaName}`, { cache: 'no-store' });
												const data = await res.json();
												const { schemaPaths } = data;
												const entries = Object.entries(schemaPaths);
												let entryTitle: string;
												let obj: { options: OptionsType; };
												let keysToDelete: any = {};
												for (let i = 0; i < entries.length; i++) {
													entryTitle = entries[i][0];
													obj = entries[i][1] as { options: OptionsType; };
													if (obj.options.file) {
														if ((item as any)[entryTitle]) {
															keysToDelete[entryTitle] = (item as any)[entryTitle]
														}
													}
												}
												const res3 = await fetch(`/api/handle_delete_item`, {
													method: 'DELETE',
													headers: {
														Accept: 'application/json',
														'Content-Type': 'application/json'
													},
													body: JSON.stringify({
														item,
														formTitle,
														title,
														keysToDelete
													}),
													cache: 'no-store'
												});
												if (res3.ok) {
													setFormSelected(prev => {
														const newData = cloneDeep(prev);
														newData.loading = false;
														return newData;
													});
													setData(prev => {
														const newData = cloneDeep(prev);
															if (title) {
																if (newData[formTitle]?.[title]) {
																	newData[formTitle][title] =
																		newData[formTitle][title]
																	.filter((str: string) => str !== item._id.toString());
																}
															}
														return newData;
													})
													if (noForm) {
														if (setItems) {
															setItems(prev => {
																const newData = cloneDeep(prev);
																if (newData.length === 1) return [] as AllDocUnionType[];
																return newData.filter(obj =>
																	obj._id.toString() !== item._id.toString()
																) as AllDocUnionType[];
															})
														}
													} else {
														if (setChosenItems) {
															setChosenItems(prev => {
																let newData = cloneDeep(prev);
																remove(newData, (arrItem) => {
																	return arrItem._id === item._id
																});
																return newData;
															})
														}
														if (setAvailableItems) {
															setAvailableItems(prev => {
																const newData = cloneDeep(prev);
																if (newData.length === 1) return [] as AllDocArrayType;
																return newData.filter(obj => obj._id !== item._id)  as AllDocArrayType;
															})
														}
													}
													setOpenModal(false)
												} else {
													const data3 = await res3.json();
													setFormSelected(prev => {
														const newData = cloneDeep(prev);
														newData.loading = false;
														return newData;
													});
													setError(data3.errorMessage);
												}
											}}
										>
											Confirm Delete
										</Button>
										<Button
											colorScheme='blue'
											mr={3}
											onClick={() => {
												setOpenModal(false);
											}}
											isDisabled={formSelected.loading}
										>
											Cancel
										</Button>
									</Center>
								</Flex>
							</ModalBody>
						</ModalContent>
					</Modal>
				</Flex>
			</Box>
			{isOver && <Box backgroundColor='var(--chakra-colors-blue-100)' height='3px'></Box>}
		</>
	)
}

export default ListFieldItem;
