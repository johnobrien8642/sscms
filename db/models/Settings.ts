import mongoose, { InferSchemaType, HydratedDocument, HydratedSingleSubdocument } from 'mongoose';
import { OptionsType } from './model-types';
import { TemplatesType } from './Templates';
const Schema = mongoose.Schema;

const optionsObj: { [key: string]: OptionsType } = {
	siteTitle: {
		formTitle: 'Site Title'
	},
	siteBgColor_dark: {
		default: '#Eeeeee',
		formTitle: 'Site Background Color (Dark)'
	},
	siteBgColor_light: {
		default: '#Eeeeee',
		formTitle: 'Site Background Color (Light)'
	},
	siteFontColor_dark: {
		default: '#Eeeeee',
		formTitle: 'Site Font Color (Dark)'
	},
	siteFontColor_light: {
		default: '#Eeeeee',
		formTitle: 'Site Font Color (Light)'
	},
	bodyFontFamily: {
		formTitle: 'Body Font Family'
	},
	headingFontFamily: {
		formTitle: 'Heading Font Family'
	},
	monoFontFamily: {
		formTitle: 'Mono Font Family'
	},
	headerNestedDropdown: {
		formTitle: 'Header Nested Dropdown?',
		default: false
	},
	schemaName: {
		default: 'Settings',
		hide: true,
		internal: true,
		required: true,
		enum: ['Settings']
	},
	updatedAt: {
		hide: true,
		internal: true
	},
	createdAt: {
		hide: true,
		internal: true
	}
}

const SettingsSchema = new Schema({
	siteTitle: {
		type: String,
		...optionsObj.siteTitle
	},
	siteBgColor_dark: {
		type: String,
		...optionsObj.siteBgColor_dark
	},
	siteBgColor_light: {
		type: String,
		...optionsObj.siteBgColor_light
	},
	siteFontColor_dark: {
		type: String,
		...optionsObj.siteFontColor_dark
	},
	siteFontColor_light: {
		type: String,
		...optionsObj.siteFontColor_light
	},
	bodyFontFamily: {
		type: String,
		...optionsObj.bodyFontFamily
	},
	headingFontFamiy: {
		type: String,
		...optionsObj.headingFontFamily
	},
	monoFontFamily: {
		type: String,
		...optionsObj.monoFontFamily
	},
	headerNestedDropdown: {
		type: Boolean,
		...optionsObj.headerNestedDropdown
	},
	schemaName: {
		type: String,
		...optionsObj.schemaName
	},
	updatedAt: {
		type: Date,
		default: Date.now,
		...optionsObj.updatedAt
	},
	createdAt: {
		type: Date,
		default: Date.now,
		...optionsObj.createdAt
	}
});

export type SettingsNoSubdocsType = InferSchemaType<typeof SettingsSchema>;
// export type SettingsType = HydratedDocument<SettingsNoSubdocsType & SettingsSubDocsType>;
export type SettingsType = SettingsNoSubdocsType & { _id: string; typeName: 'Settings' };
export type HydratedSettingsType = HydratedDocument<SettingsType>;

const Settings =
	mongoose.models?.Settings || mongoose.model<SettingsType>('Settings', SettingsSchema, 'settings');

export default Settings;
