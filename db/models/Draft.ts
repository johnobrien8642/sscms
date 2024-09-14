import mongoose, { InferSchemaType, HydratedDocument, HydratedSingleSubdocument } from 'mongoose';
import { OptionsType } from './model-types';
import Templates, { TemplatesType } from './Templates';
import models from '@db/lib/index';
const Schema = mongoose.Schema;

const optionsObj: { [key: string]: OptionsType } = {
	dataStr: {
	},
    draftId: {
    },
    draftForId: {
    },
	schemaName: {
		default: 'Draft',
		hide: true,
		internal: true,
		required: true,
		enum: ['Draft']
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

const DraftSchema = new Schema({
	dataStr: {
		type: String,
		...optionsObj.dataStr
	},
	draftId: {
		type: String,
		...optionsObj.draftId
	},
	draftForId: {
		type: String,
		...optionsObj.draftForId
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

export type DraftNoSubdocsType = InferSchemaType<typeof DraftSchema>;
// export type DraftType = HydratedDocument<DraftNoSubdocsType & DraftSubDocsType>;
export type DraftType = DraftNoSubdocsType & { _id: string; typeName: 'Draft' };
export type HydratedDraftType = HydratedDocument<DraftType>;

const Draft =
	mongoose.models?.Draft || mongoose.model<DraftType>('Draft', DraftSchema, 'drafts');

export default Draft;
