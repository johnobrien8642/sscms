import mongoose, { InferSchemaType, HydratedDocument } from 'mongoose';
import { assetTypes, textAlignOptions } from '@core/components/system/template_options';
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
		index: true,
		templates: {
			'PhotoList': 1,
			'BookCoverCTA': 1
		}
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
		index: true,
		templates: {}
	},
	thumbnailDimensions: {
		hide: true
	},
	title: {
		templates: {
			'PhotoList': 1,
			'HeadlineOnlyCTA': 1,
			'TextBlock': 1,
			'PDFView': 1
		}
	},
	type: {
		enum: assetsEnumValueArr,
		required: true,
		select: true,
		enumKey: 'assetTypes'
	},
	description: {
		textbox: true,
		formTitle: 'Regular Text',
		templates: {
			'About': 1
		}
	},
	textAlign: {
		enum: textAlignOptionsEnumValueArr,
		select: true,
		enumKey: 'textAlignOptions',
		formTitle: 'Rich Text and Title Align',
		defaultValue: 'left',
		templates: {
			'TextBlock': 1,
			'Experience': 1
		}
	},
	richDescription: {
		richText: true,
		formTitle: 'Rich Text',
		templates: {
			'About': 1,
			'Experience': 1,
			'PatronProdList': 1,
			'BookCoverCTA': 1,
			'PhotoList': 1,
			'TextBlock': 1,
			'PDFView': 1
		}
	},
	fontSize: {
		formTitle: 'Font Size',
		templates: {}
	},
	extLink: {
		formTitle: 'External Link',
		templates: {
			'LinkList': 1,
			'BookCoverCTA': 1,
			'PhotoList': 1,
			'PDFView': 1
		}
	},
	extLinkText: {
		formTitle: 'External Link Text',
		templates: {
			'LinkList': 1
		}
	},
	pagesIds: {
		formTitle: 'Page',
		filterType: false,
		templates: {
			'PDFList': 1,
		}
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
