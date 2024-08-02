const path = require('path');

module.exports = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
			{
				protocol: "http",
				hostname: "**",
			},
		],
	},
	async redirects() {
		return [
		  {
			source: '/models',
			destination: '/',
			permanent: true,
		  },
		  {
			source: '/lib',
			destination: '/',
			permanent: true,
		  },
		]
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};
