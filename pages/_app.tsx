import { AppType } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { extendTheme } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react"
import { SiteSettingsProvider } from '@core/contexts/useSiteSettings';
import { inter } from '@util/fonts';
import '@util/styles.css';

const MyApp: AppType<{ admin: boolean; settings: any; session: any; }> = ({ Component, pageProps }) => {
	let themeObj = {};
	const { settings, session } = pageProps;
	if (!session && settings) {
		const pSettings = JSON.parse(settings);
		themeObj = {
			fonts: {
				body: pSettings?.bodyFontFamily,
				heading: pSettings?.headingFontFamily,
				mono: pSettings?.monoFontFamily
			},
			components: {
				Button: {
					defaultProps: {
						colorScheme: 'black',
						variant: 'outline'
					}
				}
			},
			semanticTokens: {
				colors: {
					'chakra-body-bg': {
						_dark: pSettings?.siteBgColor_dark,
						_light: pSettings?.siteBgColor_light
					},
					'chakra-body-text': {
						_dark: pSettings?.siteFontColor_dark,
						_light: pSettings?.siteFontColor_light
					}
				}
			}
		}
	}
	useEffect(() => {
		if (session) {
			document.body.classList.add('admin')
		} else {
			document.body.classList.remove('admin')
		}
	}, [pageProps]);
	const theme = extendTheme(themeObj);
	return (
		<SessionProvider session={session}>
			<SiteSettingsProvider value={{ settings }}>
				<ChakraProvider theme={theme}>
					<DndProvider backend={HTML5Backend}>
						<main className={inter.className} style={{ overflow: 'auto', height: '100%' }}>
							<Component {...pageProps} />
						</main>
						<Analytics 
							beforeSend={(e) => {
								if (
									e.url.includes('auth') ||
										e.url.includes('admin') ||
											e.url.includes('draft')
								) {
									return null;
								}
								return e;
							}}
						/>
					</DndProvider>
				</ChakraProvider>
			</SiteSettingsProvider>
		</SessionProvider>
	)
}

export default MyApp;
