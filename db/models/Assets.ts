import mongoose, { InferSchemaType, HydratedDocument } from 'mongoose';
import { OptionsType, assetsEnumValueArr, textAlignOptionsEnumValueArr } from './model-types';
const Schema = mongoose.Schema;
const { Buffer } = Schema.Types;
import { PageType } from './Page';

const optionsObj: { [key: string]: OptionsType } = {
	assetKey: {
		file: true,
		formTitle: 'Asset File',
		dataFormKey: 'assetFile',
		dataPreviewUrl: 'assetDataUrl',
		dimensionsKey: 'assetDimensions',
		previewTypeKey: 'assetPreviewType',
		index: true
	},
	assetDimensions: {
		hide: true
	},
	thumbnailKey: {
		file: true,
		formTitle: 'Thumbnail File',
		dataFormKey: 'thumbnailFile',
		dataPreviewUrl: 'thumbnailDataUrl',
		dimensionsKey: 'thumbnailDimensions',
		previewTypeKey: 'thumbnailPreviewType',
		index: true
	},
	thumbnailDimensions: {
		hide: true
	},
	title: {
	},
	type: {
		enum: assetsEnumValueArr,
		required: true,
		select: true,
		enumKey: 'assetTypes'
	},
	description: {
		textbox: true,
		formTitle: 'Regular Text'
	},
	textAlign: {
		enum: textAlignOptionsEnumValueArr,
		select: true,
		enumKey: 'textAlignOptions',
		formTitle: 'Rich Text and Title Align',
		defaultValue: 'left'
	},
	richDescription: {
		richText: true,
		formTitle: 'Rich Text'
	},
	fontSize: {
		formTitle: 'Font Size',
		templates: {}
	},
	extLink: {
		formTitle: 'External Link'
	},
	extLinkText: {
		formTitle: 'External Link Text'
	},
	pagesIds: {
		formTitle: 'Page',
		filterType: false
	},
	isNestedChild: {
		hide: true,
		internal: true,
		required: true,
		default: false
	},
	doesNotDraft: {
		hide: true,
		internal: true,
		default: true
	},
	itemOrder: {
		hide: true,
		internal: true,
		default: 0
	},
	schemaName: {
		default: 'Assets',
		hide: true,
		internal: true,
		required: true,
		enum: ['Assets']
	},
	isDuplicate: {
		default: false,
		hide: true,
		internal: true
	},
	createdAt: {
		hide: true,
		internal: true
	}
}

const AssetsSchema = new Schema({
	assetKey: {
		type: String,
		...optionsObj.assetKey
	},
	assetDimensions: {
		type: [Number, Number],
		...optionsObj.assetDimensions
	},
	thumbnailKey: {
		type: String,
		...optionsObj.thumbnailKey
	},
	thumbnailDimensions: {
		type: [Number, Number],
		...optionsObj.thumbnailDimensions
	},
	title: {
		type: String,
		...optionsObj.title
	},
	type: {
		type: String,
		...optionsObj.type
	},
	description: {
		type: String,
		...optionsObj.description
	},
	textAlign: {
		type: String,
		...optionsObj.textAlign
	},
	richDescription: {
		type: String,
		...optionsObj.richDescription
	},
	fontSize: {
		type: String,
		...optionsObj.fontSize
	},
	extLink: {
		type: String,
		...optionsObj.extLink
	},
	extLinkText: {
		type: String,
		...optionsObj.extLinkText
	},
	pagesIds: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Page'
			}
		],
		...optionsObj.pagesIds
	},
	isNestedChild: {
		type: Boolean,
		...optionsObj.isNestedChild
	},
	doesNotDraft: {
		type: Boolean,
		...optionsObj.doesNotDraft
	},
	itemOrder: {
		type: Number,
		...optionsObj.itemOrder
	},
	schemaName: {
		type: String,
		...optionsObj.schemaName
	},
	isDuplicate: {
		type: Boolean,
		...optionsObj.isDuplicate
	},
	createdAt: {
		type: Date,
		default: Date.now,
		...optionsObj.createdAt
	}
});

// ATTN: Remember to add new subdoc fields here with proper type omit below
export type AssetsSubdocsType = {
	pagesIds: PageType[];
}

// export type AssetsType = HydratedDocument<InferSchemaType<typeof AssetsSchema>>;
export type AssetsTypeNoSubDoc = Omit<InferSchemaType<typeof AssetsSchema>, 'pagesIds'>;
export type AssetsType = AssetsTypeNoSubDoc & AssetsSubdocsType & { _id: string; typeName: 'Assets' };
export type HydratedAssetsType = HydratedDocument<AssetsType>;

const Assets =
	mongoose.models?.Assets || mongoose.model<AssetsType>('Assets', AssetsSchema, 'assets');

export default Assets;
