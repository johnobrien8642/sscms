import { NextFont } from 'next/dist/compiled/@next/font';
import { Inter, EB_Garamond } from 'next/font/google'
 
export const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
})
 
export const eb_garamond = EB_Garamond({
	subsets: ['latin'],
	display: 'swap',
})

export const siteFontsDefaultObj: {
	[key: string]: {
		[key: string]: NextFont;
	}
} = {
	'body': {
		'house-lorenz-press': inter,
		'blue-grey-card-theory': inter,
		'developer-portfolio': inter,
		'miserable-nomad': inter
	},
	'header': {
		'house-lorenz-press': inter,
		'blue-grey-card-theory': inter,
		'developer-portfolio': inter,
		'miserable-nomad': inter
	}
}