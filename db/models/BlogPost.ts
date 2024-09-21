import mongoose, { InferSchemaType, HydratedDocument, HydratedSingleSubdocument } from 'mongoose';
import { blogPostTopicOptionsEnum, OptionsType } from './model-types';
import { TemplatesType } from './Templates';
import { AssetsType } from './Assets';
import TemplateMap from '@core/components/client-templates/TemplateMap';
const Schema = mongoose.Schema;

const optionsObj: { [key: string]: OptionsType } = {
	topic: {
		enum: blogPostTopicOptionsEnum,
		formTitle: 'Blog Post Topic',
		select: true,
		default: blogPostTopicOptionsEnum[0]
	},
	title: {
		updateAllDrafts: true
	},
	folderHref: {
		required: true,
		updateAllDrafts: true,
		hide: true
	},
	subHeading: {
		formTitle: 'Sub Heading'
	},
	author: {
		formTitle: 'Author'
	},
	location: {
		formTitle: 'Location'
	},
	mainImage: {
		formTitle: 'Main Image',
		singleChoice: true,
		filterType: true
	},
	richDescription: {
		richText: true,
		formTitle: 'Rich Text'
	},
	templatesIds: {
		formTitle: 'Templates',
		filterType: true,
		xlWindow: true
	},
	prevBlog: {
		formTitle: 'Previous Blog Post',
		singleChoice: true,
		disallowCreate: true,
		filterType: false
	},
	nextBlog: {
		formTitle: 'Next Blog Post',
		singleChoice: true,
		disallowCreate: true,
		filterType: false
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
	schemaName: {
		default: 'BlogPost',
		hide: true,
		internal: true,
		required: true,
		enum: ['BlogPost']
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

const BlogPostSchema = new Schema({
	topic: {
		type: String,
		...optionsObj.topic
	},
	title: {
		type: String,
		...optionsObj.title
	},
	subHeading: {
		type: String,
		...optionsObj.subHeading
	},
	author: {
		type: String,
		...optionsObj.author
	},
	location: {
		type: String,
		...optionsObj.location
	},
	mainImage: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Assets'
			}
		],
		...optionsObj.mainImage
	},
	folderHref: {
		type: String,
		...optionsObj.folderHref
	},
	richDescription: {
		type: String,
		...optionsObj.richDescription
	},
	templatesIds: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Templates'
			}
		],
		...optionsObj.templatesIds
	},
	prevBlog: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'BlogPost'
			}
		],
		...optionsObj.prevBlog
	},
	nextBlog: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'BlogPost'
			}
		],
		...optionsObj.nextBlog
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
	this.populate({ path: 'mainImage', select: '_id assetKey assetDimensions'});
	next()
}

BlogPostSchema
	.pre('findOne', autoPopulatePages)
	.pre('find', autoPopulatePages)


export type BlogPostSubDocsType = {
	templatesIds: TemplatesType[];
	mainImage: AssetsType[];
	prevBlog: BlogPostType[];
	nextBlog: BlogPostType[];
}
export type BlogPostNoSubdocsType = Omit<InferSchemaType<typeof BlogPostSchema>, 'templatesIds' | 'mainImage' | 'prevBlog' | 'nextBlog'>;
// export type BlogPostType = HydratedDocument<BlogPostNoSubdocsType & BlogPostSubDocsType>;
export type BlogPostType = BlogPostNoSubdocsType & BlogPostSubDocsType & { _id: string; typeName: 'BlogPost' };
export type HydratedBlogPostType = HydratedDocument<BlogPostType>;

const BlogPost =
	mongoose.models?.BlogPost || mongoose.model<BlogPostType>('BlogPost', BlogPostSchema, 'blog-posts');

export default BlogPost;
