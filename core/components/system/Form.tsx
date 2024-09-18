import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
	Button,
	Text,
	Heading,
	Flex,
	Box,
	Grid,
	Modal,
	ModalHeader,
	ModalCloseButton,
	ModalOverlay,
	ModalContent,
	ModalBody,
	Center,
	Spinner
} from '@chakra-ui/react';
import FormFields from './FormFields';
import { useManagePageForm, ManagePageFormDataType, dataInitialValue } from '@core/contexts/useManagePageForm';
import { OptionsType } from '@db/models/model-types';
import { cloneDeep, kebabCase, set } from 'lodash';
import axios from 'axios';
import DraftPreview from './DraftPreview';

const Form = ({ 
	formTitleProp,
	pageManagerKey,
	bypassModal,
	revalidateAll,
	setRefetch
}: { 
	formTitleProp: string; 
	pageManagerKey?: string; 
	bypassModal?: boolean; 
	revalidateAll?: boolean;
	setRefetch: React.Dispatch<React.SetStateAction<number>>;
}) => {
	const gridContEl = useRef(null);
	const [fieldArr, setFieldArr] = useState<[string, any][]>([]);
	const [parentDoc, setParentDoc] = useState<any | null>(null);
	const [openModal, setOpenModal] = useState(false);
	const [desktopView, setDesktopView] = useState(true);
	const [desktopKeyForce, setDesktopKeyForce] = useState(0);
	const [draftPreviewKey, setDraftPreviewKey] = useState(0);
	let [error, setError] = useState('');
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
	const formTitle = useMemo(() => {
		return formCache[formCache?.active]?.formTitle ?? '';
	}, [formCache])
	useEffect(() => {
		handleModelSchema();
		async function handleModelSchema() {
			if (!formCache.active) return;
			const res = await fetch(`/api/get_model_schema?formTitle=${formTitle}`, { cache: 'no-store' });
			const data = await res.json();
			const { schemaPaths } = data;
			if (!schemaPaths) return;
			setFieldArr(Object.entries(schemaPaths));
		}
	}, [formCache]);
	const resolveHeading = useCallback(() => {
		let activeItem = formCache[formCache?.active];
		let previousItem = formCache[activeItem?.previous];
		return `${activeItem?.update? 'Edit ' : 'Create '}${activeItem?.formTitle}${previousItem ? ` for ${previousItem?.formTitle}` : ''}`
	}, [formCache]);
 	useEffect(() => {
		if (bypassModal) return;
		setDraftPreviewKey(draftPreviewKey + 1);
		if (!formCache.active) {
			handleDisableDraft();
			async function handleDisableDraft() {
				await fetch('/api/disable_draft', { cache: 'no-store' });
			}
			handleEndDrafting();
			async function handleEndDrafting() {
				await fetch(`/api/handle_end_drafting/?schemaName=${formTitleProp}`)
			}
		} else if (!bypassModal && formCache.draftId) {
			handlePersistDraftData();
			async function handlePersistDraftData() {
				await fetch(`/api/handle_persist_draft/`, {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					cache: 'no-store',
					body: JSON.stringify({
						draftDataStr: JSON.stringify(data[formCache[formCache.draftId].schemaName]),
						draftId: formCache.draftId,
						draftForId: formCache[formCache.draftId].draftForId
					}),
				});
			}
		}
	}, [formCache]);
	useEffect(() => {
		const unload = (e: any) => {
			e.preventDefault();
			handleDeleteDraft();
			async function handleDeleteDraft() {
				await fetch('/api/handle_draft', {
					method: 'DELETE',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						data: {
							...data[formCache[formCache.active].schemaName as string]
						},
					}),
					cache: 'no-store'
				});
			}
		}
		if (bypassModal) return;
		window.addEventListener('beforeunload', unload);
		return () => {
			if (bypassModal) return;
			window.removeEventListener('beforeunload', unload);
		}
	}, [data]);
	useEffect(() => {
		setDesktopKeyForce(desktopKeyForce + 1);
	}, [desktopView]);
	return (
		<Box 
			className="form container" 
			my={{ base: '0', lg: bypassModal ? '5rem' : '0' }}
			overflowY={{ base: 'scroll', lg: 'hidden' }}
			sx={{
				'form': {
					height: '100vh'
				}
			}}
		>
			{
				formCache[formCache?.active]?.formTitle && 
					<Heading
						minH='55px'
					>
						{resolveHeading()}
					</Heading>
			}
			{formCache[formCache?.active]?.activeBeingDrafted && <Text color='green' >Active Draft</Text>}
			<form
				id='sscms-form'
				onSubmit={async (e) => {
					e.preventDefault();
					setFormSelected(prev => {
						const newData = cloneDeep(prev);
						newData.loading = true;
						return newData;
					});
					if (formTitleProp === 'Page') {
						set(data[formTitleProp], 'folderHref', `/${kebabCase(data[formTitleProp].title)}`);
					}
					if (formTitleProp === 'BlogPost') {
						set(data[formTitleProp], 'folderHref', `/blog-detail/${kebabCase(data[formTitleProp].title)}`);
					}
					let dataRef: ManagePageFormDataType = data[formTitle];
					let fieldTitle: string;
					let fieldObjOptions: OptionsType;
					let file;
					if (
						data[formTitle].type === 'Image' ||
						data[formTitle].type === 'Video' ||
						data[formTitle].type === 'PDF'
					) {
						for (let i = 0; i < fieldArr.length; i++) {
							fieldTitle = fieldArr[i][0];
							fieldObjOptions = fieldArr[i][1].options;
							file = data[formTitle][fieldObjOptions.dataFormKey ?? ''];
							if (!file) continue;
							if (data.update && data[formTitle][fieldTitle]) {
								const res = await fetch(`/api/handle_s3_url`, {
									method: 'DELETE',
									headers: {
										Accept: 'application/json',
										'Content-Type': 'application/json'
									},
									body: JSON.stringify({
										keysToDelete: [data[formTitle][fieldTitle]]
									}),
									cache: 'no-store'
								});
								if (!res.ok) {
									const data = await res.json();
									const { errors } = data;
									console.log(data);
									console.log('S3 Delete Failed, object keys:', errors);
								}
							}
							const res = await fetch(`/api/handle_s3_url`, {
								method: 'POST',
								headers: {
									Accept: 'application/json',
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({
									name: file.name,
									type: file.type
								}),
								cache: 'no-store'
							});
							const data1 = await res.json()
							const { url, key } = data1;
							dataRef[fieldTitle] = process.env.NEXT_PUBLIC_DOCKER === 'true' ? `${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}/` + key : key;
							try {
								await axios.put(url, file, {
									headers: {
										'Content-Type': file.type,
										'Access-Control-Allow-Origin': '*'
									},
								});
							} catch (err) {
								console.log('Axios Error:', err)
							}
						}
					}
					if (dataRef.type !== 'PDF' && dataRef.assetDataUrl) {
						delete dataRef.assetDataUrl;
					}

					data[formTitle] = dataRef;
					const res2 = await fetch(`/api/handle_item`, {
						method: data[formTitle].update &&  !data[formTitle].saveDraft ? 'PUT' : 'POST',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							data: {
								...data[formTitle],
								pageManagerKey,
								revalidateAll
							},
							folderHref: formCache[formCache?.draftId ?? '']?.folderHref ?? data[formTitle]?.folderHref
						}),
						cache: 'no-store'
					});
					if (res2.ok) {
						const data = await res2.json()
						const { parent, parentFieldTitleRef, savedItem } = data;
						const activeItem = formCache[formCache.active];
						let previousFormTitle: string;
						if (!activeItem?.previous && !bypassModal) {
							setTopLevelModal(false);
							setData(cloneDeep(dataInitialValue));
							setFormCache({});
						} else if (activeItem?.previous) {
							previousFormTitle = formCache[activeItem.previous].formTitle;
							setFormCache((prev: any) => {
								const newFormCacheData = cloneDeep(prev);
								setData(prev => {
									const newData = cloneDeep(prev);
									newData[previousFormTitle] = cloneDeep(newFormCacheData[activeItem.previous]);
									if (parentFieldTitleRef && savedItem && !activeItem.update) {
										if (newData[previousFormTitle][parentFieldTitleRef]) {
											newData[previousFormTitle][parentFieldTitleRef].push(savedItem._id);
										} else {
											set(newData, `${previousFormTitle}.${parentFieldTitleRef}`, [savedItem._id]);
										}
									}
									newFormCacheData.active = activeItem.previous;
									delete newFormCacheData[activeItem._id];
									return newData;
								})
								return newFormCacheData;
							})
						} else if (savedItem && bypassModal) {
							setRefetch(prev => prev + 1);
						}
						setFormSelected(prev => {
							const newData = cloneDeep(prev);
							newData.loading = false;
							return newData;
						});
					} else {
						const data = await res2.json();
						console.log('Error in Form', data.errorMessage);
						setFormSelected(prev => {
							const newData = cloneDeep(prev);
							newData.loading = false;
							return newData;
						});
						setError(data.errorMessage);
					}
				}}
			>
				<Grid
					gridTemplateColumns={{ base: '1fr', lg: '49% 49%' }}
					gap='2%'
					position='relative'
					height='100vh'
					ref={gridContEl}
				>

					<Box
						// height={{ base: '100vh', lg: '100%' }}
					>
						{
							error &&
								<Text
									color='red'
									my='1rem'
								>
									{`Something went wrong: ${error}`}
								</Text>
						}
						<Flex
							my='1rem'
						>
							{
								((!data[formTitle]?.update &&
									(formTitle !== 'Page' &&
										formTitle !== 'BlogPost')) || 
											((formTitle === 'Page' ||
												formTitle === 'BlogPost') &&
													!formCache.draftId)) &&
									<Button
										type='submit'
										isDisabled={formSelected.loading}
										mr={3}
										onClick={() => {
											setData(prev => {
												const newData = cloneDeep(prev);
												if (formTitle === 'Page' || formTitle === 'BlogPost') {
													newData[formTitle].isFirstDraft = true;
													newData[formTitle].isActiveDraft = true;
												}
												return newData;
											})
										}}
									>
										Save
									</Button>
							}
							{
								data[formTitle]?.update &&
									<Button
										type='submit'
										isDisabled={
											formSelected.loading || 
												data[formTitle].activeBeingDrafted
										}
										mr={3}
									>
										Update
									</Button>
							}
							{
								(formTitle === 'Page' || 
									formTitle === 'BlogPost') &&
										formCache.draftId &&
									<>
										<Button
											type='submit'
											isDisabled={formSelected.loading}
											mr={3}
											onClick={() => {
												setData(prev => {
													const newData = cloneDeep(prev);
													// delete newData[formTitle].draftForId;
													newData[formTitle].saveDraft = true;
													newData[formTitle].isFirstDraft = false;
													return newData;
												})
											}}
										>
											Save New Draft
										</Button>	
									</>
							}
							{
								(formTitle === 'Page' ||
									formTitle === 'BlogPost') &&
								<>
									<Button
										isDisabled={formSelected.loading}
										mr={3}
										backgroundColor='var(--chakra-colors-blue-400)'
										color='white'
										onClick={() => {
											setData(prev => {
												const newData = cloneDeep(prev);
												newData[formTitle].isActiveDraft = true;
												newData[formTitle].isPublished = true;
												newData[formTitle].publishedAt = new Date();
												newData[formTitle].updateAllDraftsForPublish = true;
												return newData;
											})
											setOpenModal(true);
										}}
									>
										Save and Publish
									</Button>
									{data[formTitle]?.publishedBeingEdited &&
										<Button
											isDisabled={formSelected.loading}
											mr={3}
											backgroundColor='var(--chakra-colors-red-400)'
											color='white'
											onClick={() => {
												setData(prev => {
													const newData = cloneDeep(prev);
													newData[formTitle].isPublished = false;
													return newData;
												})
												setOpenModal(true);
											}}
										>
											Unpublish
										</Button>
									}
									<Modal
										isOpen={openModal}
										onClose={() => {
											setOpenModal(false);
										}}
									>
										<ModalOverlay />
										<ModalContent position='relative' maxW='800px'>
											<ModalHeader>{`Are you sure you want to ${data[formTitle]?.isPublished ? 'unpublish' : 'publish'} this draft?`}</ModalHeader>
											<ModalCloseButton />
											<ModalBody>
												<Flex
													flexDir='column'
													my='1rem'
												>
													<Center>
														<Button
															backgroundColor={!data[formTitle]?.isPublished ? 'var(--chakra-colors-red-400)' : 'var(--chakra-colors-blue-400)'}
															color='white'
															mr={3}
															type='submit'
															form='sscms-form'
															isDisabled={formSelected.loading}
															onClick={() => {
																setOpenModal(false);
															}}
														>
															Confirm {!data[formTitle]?.isPublished ? 'Unpublish' : 'Publish'}
														</Button>
														<Button
															colorScheme='blue'
															color='white'
															mr={3}
															onClick={() => {
																setOpenModal(false);
															}}
															isDisabled={formSelected.loading}
														>
															Cancel
														</Button>
														{formSelected.loading && <Spinner size='xl' />}
													</Center>
												</Flex>
											</ModalBody>
										</ModalContent>
									</Modal>
								</>
							}
							{formCache[formCache.active]?.previous &&
								<Button
									colorScheme='blue'
									mr={3}
									onClick={async (e) => {
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
											})
										}
										setFormCache((prev: any) => {
											const newFormCacheData = cloneDeep(prev);
											const activeItem = newFormCacheData[newFormCacheData.active];
											const previousItem = newFormCacheData[activeItem.previous];
											newFormCacheData.active = activeItem.previous;
											if (
												previousItem.schemaName === 'Page' ||
													previousItem.schemaName === 'BlogPost'
											) {
												newFormCacheData.draftId = newFormCacheData[newFormCacheData.active]._id;
											}
											setData(prev => {
												const newData = cloneDeep(prev);
												newData[previousItem.formTitle] = previousItem;
												return newData;
											})
											delete newFormCacheData[activeItem._id];
											return newFormCacheData;
										})
									}}
									isDisabled={formSelected.loading}
								>
									Cancel
								</Button>
							}
						</Flex>
						<FormFields fieldArr={fieldArr} bypassModal={bypassModal} />
					</Box>
					{
						(formCache[formCache?.draftId]?.schemaName === 'Page' ||
							formCache[formCache?.draftId]?.schemaName === 'BlogPost') &&
								<DraftPreview
									key={draftPreviewKey + desktopKeyForce}
									draftId={formCache.draftId} 
									schemaName={formCache[formCache.draftId].schemaName} 
									desktopView={desktopView}
									setDesktopView={setDesktopView}
									gridContEl={gridContEl}
								/>
					}
					{
						!formCache.draftId &&
							(
								formCache[formCache?.active]?.schemaName === 'Page' || 
									formCache[formCache?.active]?.schemaName === 'BlogPost'
							) &&
							<Text p='3rem'>Choose the title of your new page or blog post, save, and then come back to preview and add content.</Text>
					}
				</Grid>
			</form>
		</Box>
	);
};

export default Form;
