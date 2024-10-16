import { BooleanKey } from 'aws-sdk/clients/iot';
import mongoose, { Schema, Types } from 'mongoose';
typeof mongoose.SchemaTypes

// ATTN: Enum key and value should match
// template component name Pascal Cased.
export enum TemplatesEnum {
	PhotoList = 'PhotoList',
	VideoPlayer = 'VideoPlayer',
	HeadlineOnlyCTA = 'HeadlineOnlyCTA',
	TextBlock = 'TextBlock',
	PDFView = 'PDFView',
	PDFList = 'PDFList',
	PatronProdList = 'PatronProdList',
	About = 'About',
	BookCoverCTA = 'BookCoverCTA',
	OneTimePatrons = 'OneTimePatrons',
	Embed = 'Embed'
}

export enum AssetsEnum {
	Image = 'Image',
	Video = 'Video',
	PDF = 'PDF',
	Link = 'Link'
}

export enum TextAlignOptionsEnum {
	Left = 'left',
	Center = 'center',
	Right = 'right',
	None = ''
}

export enum BlogPostTopicOptionsEnum {
	Travel = 'Travel',
	Tech = 'Tech',
	BookReview = 'Book Review'
}

export type SubdocumentType = {
	type: Types.ObjectId;
	ref: string;
}

export const templatesEnumValueArr = Object.values(TemplatesEnum);
export const assetsEnumValueArr = Object.values(AssetsEnum);
export const textAlignOptionsEnumValueArr = Object.values(TextAlignOptionsEnum);
export const blogPostTopicOptionsEnum = Object.values(BlogPostTopicOptionsEnum);

export type OptionsType = {
	// Can be multiple different kinds as per mongoose, handled by Typegoose ultimately
	required?: boolean;
	default?: boolean | string | number | Date;
	index?: boolean;
	enum?: string[];
	// For accessing enum array from object (deprecated)
	enumKey?: string;
	// Default value for the select input
	defaultValue?: string;
	formTitle?: string;
	// Hide this input from the form
	hide?: boolean;
	// Display a textarea input instead of regular text input in the form
	textbox?: boolean;
	// Display a textarea input instead of regular text input in the form
	colorPicker?: boolean;
	// Use file input in the form
	file?: boolean;
	// For displaying a boolean toggle switch in the form
	select?: boolean;
	// For displaying a rich text editor in the form
	richText?: boolean;
	// For nested fields like "meta" in Page, dropdown button text in the form
	collapseTitle?: string;
	// Input is only for internal use, but could appear in the form and take input.
	// For example, if you have data that you want to use in a template, but not show
	// in the UI
	internal?: boolean;
	// For setting some data during user input, i.e. asset
	// in Assets file in assetKey, internal/background
	dataFormKey?: string;
	// For setting some preview url during user input, i.e. asset preview
	// in Assets file in assetKey, internal/background
	dataPreviewUrl?: string;
	// For setting some asset dimensions during user input,
	// i.e. asset dimensions in Assets file in assetKey, internal/background
	dimensionsKey?: string;
	// For setting some preview type during user input,
	// i.e. asset preview type key in Assets file in assetKey, internal/background
	previewTypeKey?: string;
	// For highlighting fields in use for a given template in blue,
	// i.e. this field is used in ImageGrid, include it as { 'ImageGrid': 1 }
	templates?: { [key: string]: number; };
	// For limiting subdocument choices to just a single document in the form
	singleChoice?: boolean;
	// For disallowing create new in ListField
	disallowCreate?: boolean;
	// For showing filter types for ListField if needed/available
	filterType?: boolean;
	// Only allows updating the field for the active draft
	onlyAllowUpdateActive?: boolean;
	// Makes it so field is updated for all drafts when active version
	// is updated and saved
	updateAllDrafts?: boolean;
	// For making the form list field window xl
	xlWindow?: boolean;
	helpText?: string;
	// Indicates if a field should be cloned when a draft is made
	cloneForDraft?: boolean;
	// ref to be used in ref subdocument field
	ref?: string;
}