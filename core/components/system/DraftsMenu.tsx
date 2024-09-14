import React, { useEffect, useState, useRef } from 'react'
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Button,
	Box
  } from '@chakra-ui/react'
import { useManagePageForm } from '@core/contexts/useManagePageForm.tsx';
import { AllDocUnionType } from '../types/util_types.ts';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import ListFieldItem from './ListFieldItem.tsx';

const DraftsMenu = ({ 
	formTitle,
	draftsKey,
	draftsValue
}: { 
	formTitle: string;
	draftsKey: string;
	draftsValue: string;
}) => {
	const {
		formCache,
		topLevelModal,
		setStopDrag
	} = useManagePageForm();
	const [items, setItems] = useState<AllDocUnionType[]>([]);
	const [skip, setSkip] = useState(1);
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef(null);
	const limit = 8;

	useEffect(() => {
		handleGetList();
		async function handleGetList() {
			const res = await fetch(`/api/get_form_items/?formTitle=${formTitle}&draftsKey=${draftsKey}&draftsValue=${draftsValue}`,
			{
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				cache: 'no-store'
			})
			const data = await res.json();
			const { items } = data;
			setItems(items);
		}
	}, [isOpen]);

	useEffect(() => {
		if (isOpen) {
			document.body.addEventListener('click', (e) => {
				if (
					isOpen && 
						//@ts-ignore
						!e.target.classList.contains('drafts-menu') &&
							//@ts-ignore
							!e.target.classList.contains('drafts-menu-btn') &&
								//@ts-ignore
								!e.target.classList.contains('drafts-menu-btn-icon') &&
									//@ts-ignore
									!e.target.closest('.drafts-menu')
				) {
					setIsOpen(false);
					setStopDrag(false);
				} 
			})
		}
	}, [isOpen])

	return (
		<Box
			display='block'
			verticalAlign='center'
			position='relative'
			padding='0'
			width='50px'
			background='none !important'
			cursor='pointer'
			tabIndex={0}
			aria-label='drafts dropdown'
		>
			{
				<Button
					onClick={() => setIsOpen(!isOpen)}
					className='drafts-menu-btn'
				>
					{
						isOpen ? 
							<ChevronDownIcon 
								fontSize='1.6rem'
								className='drafts-menu-btn-icon'
							/> : 
								<ChevronRightIcon
									fontSize='1.6rem'
									className='drafts-menu-btn-icon'
								/>
					}	
				</Button>
			}
			<Box
				className='drafts-menu'
				display={isOpen ? 'block' : 'none'}
				position='absolute'
				top='130%'
				width='600px'
				zIndex='99'
				height='500px'
				overflow='auto'
				backgroundColor='white'
				boxShadow='0px 6px 33px -7px black'
				tabIndex={isOpen ? 1 : 0}
				ref={menuRef}
			>
				{
					items?.map((obj, index) => {
						return <ListFieldItem
							key={obj._id}
							item={obj}
							noForm={true}
							setItems={setItems}
							index={index}
							insideDraftsModal
						/>
					})
				}
			</Box>
		</Box>
	)
}

export default DraftsMenu;
