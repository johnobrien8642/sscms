import mongoose, { InferSchemaType, HydratedDocument, HydratedSingleSubdocument } from 'mongoose';
import { OptionsType } from './model-types';
import { TemplatesType } from './Templates';
const Schema = mongoose.Schema;

const optionsObj: { [key: string]: OptionsType } = {
	metaTitle: {
		formTitle: 'Meta Title'
	},
	folderHref: {
		required: true,
		hide: true
	},
	showInNavigation: {
		default: true,
		formTitle: 'Show in Navigation'
	},
	richDescription: {
		richText: true,
		formTitle: 'Rich Text'
	},
	templatesIds: {
		formTitle: 'Templates',
		filterType: true
	},
	schemaName: {
		default: 'BlogPost',
		hide: true,
		internal: true,
		required: true,
		enum: ['BlogPost']
	},
	meta: {
		collapseTitle: 'Meta Info'
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

const BlogPostSchema = new Schema({
	title: {
		type: String,
		validate: {
			validator: async function(title: string) {
				//@ts-ignore
				const blog = await this.constructor.findOne({ title });
				return !blog;
			},
			message: () => 'That title is already in use, please choose another.'
		},
	},
	folderHref: {
		type: String,
		...optionsObj.folderHref
	},
	showInNavigation: {
		type: Boolean,
		...optionsObj.showInNavigation
	},
	richDescription: {
		type: String,
		...optionsObj.description
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
	schemaName: {
		type: String,
		...optionsObj.schemaName
	},
	meta: {
		type: MetaDropdownSchema,
		...optionsObj.meta
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

export type MetaDropdownType = InferSchemaType<typeof MetaDropdownSchema>;
export type BlogPostSubDocsType = {
	childPagesIds: BlogPostType[];
	templatesIds: TemplatesType[];
	meta: MetaDropdownType;
}
export type BlogPostNoSubdocsType = Omit<InferSchemaType<typeof BlogPostSchema>, 'templatesIds'>;
// export type BlogPostType = HydratedDocument<BlogPostNoSubdocsType & BlogPostSubDocsType>;
export type BlogPostType = BlogPostNoSubdocsType & BlogPostSubDocsType & { _id: string; typeName: 'BlogPost' };
export type HydratedBlogPostType = HydratedDocument<BlogPostType>;

const BlogPost =
	mongoose.models?.BlogPost || mongoose.model<BlogPostType>('BlogPost', BlogPostSchema, 'blog-posts');

export default BlogPost;
