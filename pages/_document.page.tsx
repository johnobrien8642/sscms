
import React, { ReactElement } from "react";
import Document, { Head, Html, Main, NextScript } from "next/document";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google'

class CustomDocument extends Document {
	render(): ReactElement {
		return (
			<Html>
				<body>
					<Main />
					<NextScript />
					<Analytics />
				</body>
				<SpeedInsights />
				<GoogleAnalytics gaId="G-43X5QW7Z85" />
			</Html>
		);
	}
}

export default CustomDocument;