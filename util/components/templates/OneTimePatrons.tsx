import React, { useEffect, useState } from 'react';

const OneTimePatrons = ({ template }) => {
	const [sales, setSales] = useState(null);
	useEffect(() => {
		fetchSales()
		async function fetchSales() {
			const res = 
				await fetch(`https://api.gumroad.com/v2/sales?access_token=${process.env.NEXT_PUBLIC_GUMROAD_API_KEY}`)
			const data = await res.json();
			console.log(data)
		}
	}, [])

	return <></>
}

export default OneTimePatrons;