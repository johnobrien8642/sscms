import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
	Input,
	Box,
	Text,
	Textarea,
	Select,
	FormControl,
	FormLabel,
	Switch,
	Button,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	Skeleton
} from '@chakra-ui/react'
import { capitalize } from 'lodash';
import ListField from './ListField';
import { useManagePageForm } from '@core/contexts/useManagePageForm';
import { cloneDeep, get, set, startCase } from 'lodash';
import { OptionsType } from '@db/models/model-types';
import { useBreakpointValue } from '@chakra-ui/react';
const Editor = dynamic(() => import('./Editor'), { ssr: false });

const FormFields = ({ fieldArr, bypassModal }: { fieldArr?: [string, any][]; bypassModal?: boolean; }) => {
	const [fields, setFields] = useState<[string, any][] | undefined>(fieldArr);
	const { data, setData, formSelected, formCache, topLevelModal } = useManagePageForm();
	const desktop = useBreakpointValue({
		base: false,
		lg: true
	});
	const formTitle = useMemo(() => {
		return formCache[formCache.active]?.formTitle ?? '';
	}, [fieldArr]);
	useEffect(() => {
		setFields(fieldArr)
	}, [fieldArr]);
	function resolveInput(title: string, obj: { options: OptionsType; instance: string; $embeddedSchemaType: any; }) {
		const resolvedValue = get(data[formTitle], title, '');
		const resolveValue = (e: Event | ChangeEvent | FormEvent<HTMLInputElement>) => {
			setData(prev => {
				const newData = cloneDeep(prev);
				set(newData[formTitle], title, innerResolveValue((e.target as HTMLInputElement).value));
				return newData;
			})
			if (formTitle === 'Templates' && title === 'type') {
				// @ts-expect-error something something "needs a [Symbol.iterator]()" idk doesn't make sense
				setFields([...fields])
			}
			function innerResolveValue(val: string | undefined) {
				if (val === 'true') return false;
				if (val === 'false') return true;
				return val;
			}
		}
		if (obj.instance === 'Array') {
			return <ListField
				title={title}
				obj={obj}
				singleChoice={obj.options?.singleChoice}
			/>
		} else if (obj.instance === 'String' && obj.options.textbox) {
			return <Textarea
				value={resolvedValue}
				size='lg'
				onChange={e => resolveValue(e)}
			/>
		} else if (obj.instance === 'String' && obj.options.richText) {
				return <Editor
					data={data[formTitle][title] ?? ''}
					setData={setData}
					formTitle={formTitle}
					title={title}
				/>
		} else if (obj.instance === 'String' && obj.options.select) {
			return <Select
				onChange={e => resolveValue(e)}
				placeholder='Select One'
				value={resolvedValue}
			>
				{
					obj.options.enum && obj.options.enum.map(str => {
						return <option key={str} value={str}>{startCase(str)}</option>
					})
				}
			</Select>
		} else if (obj.instance === 'Boolean') {
			return <Switch
				id={title}
				isChecked={data[formTitle][title]}
				value={data[formTitle][title]}
				onChange={e => resolveValue(e)}
				size='lg'
			/>
		} else {
			if (obj.options.file) {
				return <Box>
					<Input
						id={title}
						value={undefined}
						accept='.png,.jpg,.jpeg,.pdf,.mov,.mp4'
						type='file'
						disabled={data[formTitle][obj.options.dataFormKey ?? '']}
						onInput={async (e: FormEvent<HTMLInputElement>) => {
							await handleDataUpdate()
							async function handleDataUpdate() {
								const blobToData = (file: File) => {
									if (file.type.includes('video')) return '';
									return new Promise((resolve) => {
										const reader = new FileReader()
										reader.onloadend = () => resolve(reader.result);
										reader.readAsDataURL(file)
									})
								}
								if (!(e.target as HTMLInputElement)?.files) return;
								//@ts-expect-error error is unnecessary it's handled by line above
								const dataUrl = await blobToData((e.target as HTMLInputElement).files[0])
								setData((prev) => {
									if (!(e.target as HTMLInputElement)?.files) return prev;
									const newData = cloneDeep(prev);
									newData[formTitle][obj.options.dataFormKey ?? ''] = (e.target as HTMLInputElement)?.files?.[0];
									newData[formTitle][obj.options.dataPreviewUrl ?? ''] = dataUrl;
									newData[formTitle][obj.options.previewTypeKey ?? ''] = (e.target as HTMLInputElement)?.files?.[0].type;
									return newData;
								})
							}
						}}
					/>
					{
						data[formTitle][obj.options.dataFormKey ?? ''] &&
							<Button
								onClick={() => {
									setData((prev) => {
										const newData = cloneDeep(prev);
										newData[formTitle][obj.options.dataFormKey ?? ''] = '';
										newData[formTitle][obj.options.dataPreviewUrl ?? ''] = '';
										newData[formTitle][obj.options.previewTypeKey ?? ''] = '';
										const el: HTMLInputElement | null = document.querySelector(`#${title}`);
										if (el) {
											el.value = '';
										}
										return newData;
									})
								}}
							>
								Clear
							</Button>
					}
					{
						data[formTitle][title] &&
							data[formTitle].type === 'Image' &&
								formSelected.update &&
									<>
										<Text>Current Image</Text>
										<Image
											width='100'
											height='100'
											alt={data[formTitle]?.[title] ?? 'alt'}
											src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + data[formTitle][title]}
										/>
									</>
					}
					{
						data[formTitle].type === 'Image' &&
							data[formTitle]?.[obj.options.dataPreviewUrl ?? ''] &&
								<>
									<Text>Current Image</Text>
									<Image
										width='100'
										height='100'
										alt={data[formTitle]?.[title] ?? 'alt'}
										src={data[formTitle][obj.options.dataPreviewUrl ?? '']}
										onLoad={(e) => {
											setData(prev => {
												const newData = cloneDeep(prev);
												newData[formTitle][obj.options.dimensionsKey ?? ''] =
													[e.currentTarget.naturalWidth, e.currentTarget.naturalHeight];
												return newData;
											})
										}}
									/>
								</>
					}
				</Box>
			} else {
				return <>
					<Input
						value={resolvedValue}
						type={obj.instance.toLowerCase()}
						onInput={e => resolveValue(e)}
						disabled={formCache.insideDraftsModal && obj.options.onlyAllowUpdateActive}
					/>
					{
						formCache.insideDraftsModal && 
							obj.options.onlyAllowUpdateActive && 
								<Text p='1rem' opacity='.5' >Can only update active version</Text>
					}
				</>
			}
		}
	}
	
	if (bypassModal || topLevelModal) {
		return (
			<Box
				position='relative'
				zIndex={98}
				sx={{
					'.ck-content': {
						minHeight: '220px'
					},
					'> div:last-child': {
						marginBottom: desktop ? '18rem' : '0'
					}
				}}
				overflowY={{ base: 'hidden', lg: 'scroll' }}
				height={{ base: '100%', lg: '100vh' }}
			>
				{
					fields?.flatMap((sub, i) => {
						const titleLevel1: string = sub[0];
						const obj: any = sub[1];
						if (
							formCache?.[
								formCache[formCache.active]?.previous
							]?.formTitle === 'Templates' &&
								obj.options?.templates && 
									!obj.options?.templates
										?.[data['Templates'].type]
						) return [];
						if (obj.options.collapseTitle) {
							return <Skeleton isLoaded={!formSelected.loading} key={titleLevel1 + obj.options}>
								<Accordion allowToggle mb='1rem'>
									<AccordionItem>
										<AccordionButton>
											{obj.options.collapseTitle}
										<AccordionIcon />
										</AccordionButton>
										<AccordionPanel>
											{
												Object.entries(obj.options.type.paths).map(sub => {
													const titleLevel2: string = sub[0];
													const obj: any = sub[1];
													if (!obj.options.hide && !titleLevel2.match('_id') && !titleLevel2.match('__v')) {
														return <FormControl my='1rem' height='fit-content' key={titleLevel2} isRequired={obj.isRequired}>
															<FormLabel htmlFor={titleLevel2}>{capitalize(obj.options.formTitle ?? titleLevel2)}</FormLabel>
															{resolveInput(`${titleLevel1}.${titleLevel2}`, obj)}
														</FormControl>
													}
												})
											}
										</AccordionPanel>
									</AccordionItem>
								</Accordion>
							</Skeleton>
						} else if (!obj.options.hide && !titleLevel1.match('_id') && !titleLevel1.match('__v')) {
							return <FormControl
								my='1rem'
								border='5px solid rgb(0, 0, 0, .05)'
								borderRadius='5%'
								p='1.5rem'
								key={titleLevel1}
								isRequired={obj.isRequired}
							>
								<FormLabel
									htmlFor={titleLevel1}
									fontSize='1.4rem'
								>
									{capitalize(obj.options.formTitle ?? titleLevel1)}
								</FormLabel>
								<Skeleton isLoaded={!formSelected.loading}>
									{resolveInput(titleLevel1, obj)}
								</Skeleton>
							</FormControl>
						}
					})
				}
			</Box>
		)
	} else {
		return <></>
	}
}

export default FormFields;