import mongoose, { InferSchemaType, HydratedDocument, Types } from 'mongoose';
import { OptionsType, templatesEnumValueArr, blogPostTopicOptionsEnum } from './model-types';
import { AssetsType } from './Assets';
import { TextType } from './Text';
import { PageType } from './Page';
import TemplateMap from '@core/components/client-templates/TemplateMap';
const Schema = mongoose.Schema;

const optionsObj: { [key: string]: OptionsType } = {
	title: {
		templates: {}
	},
	type: {
		required: true,
		enum: Object.keys(TemplateMap[process.env.NEXT_PUBLIC_SITE_FOLDER as string]),
		formTitle: 'Template Type',
		select: true,
		enumKey: 'templateOptions'
	},
	showMobile: {
		default: true,
		formTitle: 'Show in Mobile'
	},
	textIds: {
		formTitle: 'Text',
		filterType: true,
		cloneForDraft: true,
		xlWindow: true,
		ref: 'Text'
	},
	assetsIds: {
		formTitle: 'Assets',
		filterType: true,
		cloneForDraft: false,
		xlWindow: true,
		ref: 'Assets'
	},
	description: {
		textbox: true,
		templates: {}
	},
	richDescription: {
		richText: true,
		formTitle: 'Rich Text'
	},
	extLink: {
		formTitle: 'External Link'
	},
	pagesIds: {
		formTitle: 'Page',
		filterType : false,
		cloneForDraft: false,
		ref: 'Page'
	},
	isNestedChild: {
		hide: true,
		internal: true,
		required: true,
		default: false
	},
	linksIds: {
		formTitle: 'Links',
		filterType: true,
		cloneForDraft: true,
		ref: 'Assets'
	},
	// This could actually just be like extAssetLink, not videoId
	videoId: {
		formTitle: 'Exterior Asset To Link To',
		singleChoice: true,
		templates: {},
		filterType: true,
		cloneForDraft: true,
		ref: 'Assets'
	},
	blogListTopic: {
		enum: blogPostTopicOptionsEnum,
		formTitle: 'Blog List Topic',
		select: true,
		default: blogPostTopicOptionsEnum[0]
	},
	schemaName: {
		default: 'Templates',
		hide: true,
		internal: true,
		required: true,
		enum: ['Templates']
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
	isDuplicate: {
		default: false,
		hide: true,
		internal: true
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

const TemplatesSchema = new Schema({
	title: {
		type: String,
		...optionsObj.title
	},
	type: {
		type: String,
		...optionsObj.type
	},
	showMobile: {
		type: Boolean,
		...optionsObj.showMobile
	},
	textIds: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: optionsObj.textIds.ref
			}
		],
		...optionsObj.textIds
	},
	assetsIds: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: optionsObj.assetsIds.ref
			}
		],
		...optionsObj.assetsIds
	},
	description: {
		type: String,
		...optionsObj.description
	},
	richDescription: {
		type: String,
		...optionsObj.richDescription
	},
	extLink: {
		type: String,
		...optionsObj.extLink
	},
	linksIds: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: optionsObj.linksIds.ref
			}
		],
		...optionsObj.linksIds
	},
	videoId: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: optionsObj.assetsIds.ref
			}
		],
		...optionsObj.videoId
	},
	pagesIds: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: optionsObj.pagesIds.ref
			}
		],
		...optionsObj.pagesIds
	},
	blogListTopic: {
		type: String,
		...optionsObj.blogListTopic
	},
	isNestedChild: {
		type: Boolean,
		...optionsObj.isNestedChild
	},
	isDuplicate: {
		type: Boolean,
		...optionsObj.isDuplicate
	},
	itemOrder: {
		type: Number,
		...optionsObj.itemOrder
	},
	schemaName: {
		type: String,
		...optionsObj.schemaName
	},
	doesNotDraft: {
		type: Boolean,
		...optionsObj.doesNotDraft
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

// ATTN: Remember to add new subdoc fields here with proper type omit below
export type TemplatesSubdocsType = {
	textIds: TextType[];
	assetsIds: AssetsType[];
	videoId: AssetsType[];
	linksIds: AssetsType[];
	pagesIds: PageType[];
}
export type TemplatesTypeNoSubDoc = Omit<InferSchemaType<typeof TemplatesSchema>, 'assetsIds' | 'linksIds' | 'videoId' | 'pagesIds' | 'textIds'>;
// export type TemplatesType = HydratedDocument<TemplatesTypeNoSubDoc & TemplatesSubdocsType>;
export type TemplatesType = TemplatesTypeNoSubDoc & TemplatesSubdocsType & { _id: string; typeName: 'Templates' };
export type HydratedTemplatesType = HydratedDocument<TemplatesType>;
const Templates =
	mongoose.models?.Templates || mongoose.model<TemplatesType>('Templates', TemplatesSchema, 'templates');

export default Templates;
