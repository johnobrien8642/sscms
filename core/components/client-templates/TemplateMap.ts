// demo
import D_PhotoList from "./demo/PhotoList";
import D_VideoPlayer from "./demo/VideoPlayer";
import D_HeadlineOnlyCTA from "./demo/HeadlineOnlyCTA";
import D_TextBlock from "./demo/TextBlock";
import D_PDFView from "./demo/PDFView";
import D_PDFList from "./demo/PDFList";
import D_BookCoverCTA from "./demo/BookCoverCTA";
import D_About from "./demo/About";
import D_EmbedComp from './demo/Embed';
import D_BlogList from './demo/BlogList';
import D_SideBySide from './demo/SideBySide';
import D_SinglePhotoHighlight from './demo/SinglePhotoHighlight';
import D_BlogDetail from './demo/BlogDetail';

const TemplateMap: { [key: string]: { [key: string]: any} } = {
	//Add as many sites as you want here following this same import convention.
	//Your client-templates folder name should match your NEXT_PUBLIC_SITE_FOLDER env var.
	//This gives you the ability to separate templates for different sites, all using the same repo.
	'demo': {
		'PhotoList': D_PhotoList,
		'VideoPlayer': D_VideoPlayer,
		'TextBlock': D_TextBlock,
		'HeadlineOnlyCTA': D_HeadlineOnlyCTA,
		'PDFList': D_PDFList,
		'PDFView': D_PDFView,
		'BookCoverCTA': D_BookCoverCTA,
		'About': D_About,
		'Embed': D_EmbedComp,
		'BlogList': D_BlogList,
		'SinglePhotoHighlight': D_SinglePhotoHighlight,
		'SideBySide': D_SideBySide,
		'BlogDetail': D_BlogDetail
	},
	// 'some-other-site': { 
	//    'AnotherTemplate: SOS_AnotherTemplate,
	//    ... so on and so forth
	// }
}

export default TemplateMap;