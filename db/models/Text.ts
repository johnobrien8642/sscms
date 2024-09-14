import mongoose, { InferSchemaType, HydratedDocument } from 'mongoose';
import { OptionsType } from './model-types';
const Schema = mongoose.Schema;

const optionsObj: { [key: string]: OptionsType } = {
	title: {
	},
	richDescription: {
		richText: true,
		formTitle: 'Rich Text'
	},
	fontSize: {
		formTitle: 'Font Size',
		templates: {}
	},
	isNestedChild: {
		hide: true,
		internal: true,
		required: true,
		default: false
	},
	itemOrder: {
		hide: true,
		internal: true,
		default: 0
	},
	schemaName: {
		default: 'Text',
		hide: true,
		internal: true,
		required: true,
		enum: ['Text']
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

const TextSchema = new Schema({
	title: {
		type: String,
		...optionsObj.title
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

// export type TextType = HydratedDocument<InferSchemaType<typeof TextSchema>>;
export type TextTypeNoSubDoc = InferSchemaType<typeof TextSchema>;
export type TextType = TextTypeNoSubDoc & { _id: string; typeName: 'Text' };
export type HydratedTextType = HydratedDocument<TextType>;

const Text =
	mongoose.models?.Text || mongoose.model<TextType>('Text', TextSchema, 'texts');

export default Text;
