import React from 'react';
import Pagination from 'rc-pagination';
import { Box } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

const MyPagination = ({
	current,
	totalItems,
	onChange,
	pageSize
}: {
	current: number;
	totalItems: number;
	onChange: (page: number) => void;
	pageSize: number;
}) => {
	return <Box
		w='100%'
		mb='2rem'
		sx={{
			'ul': {
				listStyle: 'none',
			},
			'.rc-pagination-item': {
				border: '.5px solid black',
				padding: '.4rem .5rem',
				cursor: 'pointer'
			},
			'.rc-pagination-item-active': {
				backgroundColor: 'lightgray',
			},
			'.rc-pagination-prev, .rc-pagination-next': {
				display: 'flex',
				alignItems: 'center',
				fontSize: '2.2rem',
				cursor: 'pointer',
				marginInline: '1rem'
			}
		}}
	>
		<Pagination
			current={current}
			total={totalItems}
			pageSize={pageSize}
			prevIcon={<ChevronLeftIcon />}
			nextIcon={<ChevronRightIcon />}
			jumpPrevIcon={<ArrowLeftIcon />}
			jumpNextIcon={<ArrowRightIcon />}
			onChange={(page: number, pageSize: number) => {
				onChange(page)
			}}
			style={{
				display: 'flex',
				margin: 'auto',
				width: '20%',
				fontSize: '1.4rem',
			}}
		/>
	</Box>
}

export default MyPagination;