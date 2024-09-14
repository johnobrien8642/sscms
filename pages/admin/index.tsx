import React, { useEffect } from 'react';
import dbConnect from '@db/lib/mongodb';
import Settings from '@db/models/Settings';
import Head from 'next/head';
import OAuthLoginForm from '@core/components/system/OAuthLoginForm';
import { useRouter } from 'next/router';
import { AdminType } from '@db/models/Admin';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@pages/api/auth/[...nextauth]';

type PageProps = {
	admin: AdminType;
	settings: string;
}

const AdminPage: NextPage<PageProps> = ({ admin, settings }) => {
	const router = useRouter();
	useEffect(() => {
		if (admin) {
			router.push('/admin/manage-pages')
		}
	}, [])
	if (!admin) {
		return (
			<>
				<Head>
					<meta name="robots" content="noindex,nofollow" />
				</Head>
				<OAuthLoginForm  settings={settings} />
			</>
		);
	} else {
		return <></>
	}
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	await dbConnect();
	const { req, res } = context;
	const session = await getServerSession(req, res, authOptions);
	const settings =
		await Settings
			.findOne({});
	return {
		props: {
			admin: !!session,
			settings: JSON.stringify(settings)
		}
	};
}

export default AdminPage;
