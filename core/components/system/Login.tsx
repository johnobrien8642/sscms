import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import {
	Input,
	Center,
	Button,
	Text,
	FormControl,
	FormLabel,
	Skeleton,
	Heading,
	Checkbox,
	Flex,
	Spinner
} from '@chakra-ui/react';

const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPW, setConfirmPW] = useState('');
	const [error, setError] = useState('');
	const [checkingFirst, setCheckingFirst] = useState(true);
	const [loading, setLoading] = useState(false);
	const [firstTimeUser, setFirstTimeUser] = useState(false);
	const [showPWs, setShowPWs] = useState(false);
	const router = useRouter();

	useEffect(() => {
		handleCheckFirstTime();
		async function handleCheckFirstTime() {
			const res = await fetch(`/api/check_admin_exists`, { cache: 'no-store' });
			const data = await res.json();
			const { admin } = data;
			setFirstTimeUser(!admin);
			setCheckingFirst(false)
		}
	}, [])

	if (checkingFirst) {
		return <Center mt='10%'><Spinner boxSize={100} /></Center>
	} else {
		return (
			<Center
				flexDirection={'column'}
				p='3rem'
			>
				
			</Center>
		);
	}
};

export default Login;
