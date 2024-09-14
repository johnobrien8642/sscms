import { Button } from '@chakra-ui/react'
import { signOut } from "next-auth/react"


const Logout = ({}) => {
	return (
		<div className="logout container">
			<Button
				onClick={(e) => {
					e.preventDefault();
					signOut();
				}}
			>
				logout
			</Button>
		</div>
	);
};

export default Logout;
