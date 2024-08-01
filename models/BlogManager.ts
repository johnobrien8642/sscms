import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';
import { OptionsType } from './model-types';
import { BlogPostType } from './BlogPost';
const Schema = mongoose.Schema;

const optionsObj: { [key: string]: OptionsType } = {
	title: {
		required: true
	},
	createdAt: {
		hide: true
	}
}

const PageManagerSchema = new Schema({
	title: {
		type: String,
		...optionsObj.title
	},
	blogIds: [
		{
			type: mongoose.Types.ObjectId,
			ref: 'BlogPost'
		}
	],
	createdAt: {
		type: Date,
		default: Date.now,
		...optionsObj.createdAt
	}
});

function autoPopulatePages(next: any) {
	//@ts-expect-error
	this.populate('blogIds');
	next()
}

PageManagerSchema
	.pre('findOne', autoPopulatePages)
	.pre('find', autoPopulatePages)

export type PageManagerSubDocsType = {
	pageIds: PageType[];
}
export type PageManagerNoSubdocsType = Omit<InferSchemaType<typeof PageManagerSchema>, 'pageIds'>;
// export type PageType = HydratedDocument<PageNoSubdocsType & PageSubDocsType>;
export type PageManagerType = PageManagerNoSubdocsType & PageManagerSubDocsType & { _id: string; };
export type HydratedPageManagerType = HydratedDocument<PageManagerType>;

const PageManager =
	mongoose.models.PageManager || mongoose.model('PageManager', PageManagerSchema, 'page-managers');

export default PageManager;
