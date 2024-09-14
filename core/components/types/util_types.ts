import { AssetsType } from "@db/models/Assets"
import { TemplatesType } from "@db/models/Templates"
import { PageType } from "@db/models/Page"
import { BlogPostType } from "@db/models/BlogPost"
import { TextType } from "@db/models/Text"

// export type AllDocItemType<T extends AssetsType | TemplatesType | PageType>
// = T extends AssetsType ? AssetsType :
// T extends TemplatesType ? TemplatesType :
// T extends PageType ? PageType : T;


// export type AllDocUnionType<T extends 'Assets' | 'Templates' | 'Page'> = T extends 'Assets' ? AssetsType : T extends 'Templates' ? TemplatesType : T extends 'Page' ? PageType : T;
export type AllDocUnionType = AssetsType | TemplatesType | PageType | BlogPostType | TextType;
export type AllDocUnionTypeDyn<T extends 'Assets' | 'Templates' | 'Page' | 'BlogPostType' | 'TextType'>
	= T extends 'Assets' ? AssetsType :
	T extends 'Templates' ? TemplatesType :
	T extends 'Page' ? PageType :
	T extends 'BlogPost' ? BlogPostType :
	T extends 'TextType' ? TextType : T;
export type AllDocIntersectionType = AssetsType & TemplatesType & PageType & BlogPostType;
export type AllDocType = { [key in keyof AllDocIntersectionType]: string; } & AllDocUnionType;
export type AllDocArrayUnionType = AssetsType[] | TemplatesType[] | PageType[] | BlogPostType[];
export type AllDocArrayType = AllDocArrayUnionType;

export type AllDocTypeObj = {
	Assets: AssetsType;
	Templates: TemplatesType;
	Page: PageType;
	BlogPost: BlogPostType;
	Text: TextType;
}
