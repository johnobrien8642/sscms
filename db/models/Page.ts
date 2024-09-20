import mongoose, { InferSchemaType, HydratedDocument, HydratedSingleSubdocument } from 'mongoose';
import { OptionsType } from './model-types';
import Templates, { TemplatesType } from './Templates';
import models from '@db/lib/index';
const Schema = mongoose.Schema;

const optionsObj: { [key: string]: OptionsType } = {
	title: {
		// helpText: 'This is',
		updateAllDrafts: true
	},
	metaTitle: {
		formTitle: 'Meta Title'
	},
	metaDescription: {
		formTitle: 'Meta Description'
	},
	meta: {
		collapseTitle: 'Meta Info'
	},
	folderHref: {
		required: true,
		hide: true,
		updateAllDrafts: true
	},
	showInNavigation: {
		default: true,
		formTitle: 'Show in Navigation',
		updateAllDrafts: true
	},
	description: {
		textbox: true
	},
	templatesIds: {
		formTitle: 'Templates',
		filterType: true,
		cloneForDraft: true,
		xlWindow: true,
		ref: 'Templates'
	},
	childPagesIds: {
		formTitle: 'Child Pages',
		filterType: true,
		cloneForDraft: false,
		updateAllDrafts: true,
		ref: 'Page'
	},
	pageBodyBgImage: {
		formTitle: 'Page Body Bg Image',
		singleChoice: true,
		filterType: true,
		cloneForDraft: false,
		ref: 'Assets'
	},
	isNestedChild: {
		hide: true,
		internal: true,
		required: true,
		default: false
	},
	isActiveDraft: {
		hide: true,
		internal: true,
		required: true,
		default: false
	},
	isFirstDraft: {
		hide: true,
		internal: true,
		required: true,
		default: true
	},
	isPublished: {
		hide: true,
		internal: true,
		required: true,
		default: false
	},
	beingDrafted: {
		hide: true,
		internal: true,
		required: true,
		default: false
	},
	hasDrafts: {
		hide: true,
		internal: true,
		required: true,
		default: true
	},
	schemaName: {
		default: 'Page',
		hide: true,
		internal: true,
		required: true,
		enum: ['Page']
	},
	formOrder: {
		hide: true,
		internal: true,
		required: true
	},
	publishedAt: {
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

const MetaDropdownSchema = new Schema({
	metaTitle: {
		type: String,
		...optionsObj.metaTitle
	},
	metaDescription: {
		type: String,
		...optionsObj.metaDescription
	}
})

const PageSchema = new Schema({
	title: {
		type: String,
		...optionsObj.title
	},
	folderHref: {
		type: String,
		...optionsObj.folderHref
	},
	showInNavigation: {
		type: Boolean,
		...optionsObj.showInNavigation
	},
	description: {
		type: String,
		...optionsObj.description
	},
	templatesIds: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: optionsObj.templatesIds.ref
			}
		],
		...optionsObj.templatesIds
	},
	childPagesIds: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: optionsObj.childPagesIds.ref
			}
		],
		...optionsObj.childPagesIds
	},
	pageBodyBgImage: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Assets'
			}
		],
		...optionsObj.pageBodyBgImage
	},
	isNestedChild: {
		type: Boolean,
		...optionsObj.isNestedChild
	},
	isActiveDraft: {
		type: Boolean,
		...optionsObj.isActiveDraft
	},
	isFirstDraft: {
		type: Boolean,
		...optionsObj.isFirstDraft
	},
	isPublished: {
		type: Boolean,
		...optionsObj.isPublished
	},
	beingDrafted: {
		type: Boolean,
		...optionsObj.beingDrafted
	},
	hasDrafts: {
		type: Boolean,
		...optionsObj.hasDrafts
	},
	meta: {
		type: MetaDropdownSchema,
		...optionsObj.meta
	},
	formOrder: {
		type: Number,
		...optionsObj.formOrder
	},
	schemaName: {
		type: String,
		...optionsObj.schemaName
	},
	publishedAt: {
		type: Date,
		default: new Date(),
		...optionsObj.publishedAt
	},
	updatedAt: {
		type: Date,
		default: new Date(),
		...optionsObj.updatedAt
	},
	createdAt: {
		type: Date,
		default: new Date(),
		...optionsObj.createdAt
	}
});

function autoPopulatePages(next: any) {
	//@ts-expect-error
	this.populate('childPagesIds');
	next()
}

PageSchema
	.pre('findOne', autoPopulatePages)
	.pre('find', autoPopulatePages)



export type MetaDropdownType = InferSchemaType<typeof MetaDropdownSchema>;
export type PageSubDocsType = {
	childPagesIds: PageType[];
	templatesIds: TemplatesType[];
	meta: MetaDropdownType;
}
export type PageNoSubdocsType = Omit<InferSchemaType<typeof PageSchema>, 'templatesIds' | 'childPagesIds' | 'meta'>;
// export type PageType = HydratedDocument<PageNoSubdocsType & PageSubDocsType>;
export type PageType = PageNoSubdocsType & PageSubDocsType & { _id: string; typeName: 'Page' };
export type HydratedPageType = HydratedDocument<PageType>;

const Page =
	mongoose.models?.Page || mongoose.model<PageType>('Page', PageSchema, 'pages');

export default Page;
