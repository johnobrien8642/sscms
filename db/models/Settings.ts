import mongoose, { InferSchemaType, HydratedDocument, HydratedSingleSubdocument } from 'mongoose';
import { OptionsType } from './model-types';
import { TemplatesType } from './Templates';
const Schema = mongoose.Schema;

const optionsObj: { [key: string]: OptionsType } = {
	siteTitle: {
		formTitle: 'Site Title'
	},
	siteBgColor: {
		default: '#Eeeeee',
		formTitle: 'Site Background Color'
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
	siteBgColor: {
		type: String,
		...optionsObj.siteBgColor
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
