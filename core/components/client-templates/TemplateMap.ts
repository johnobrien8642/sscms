import React from "react";
import { TemplatesEnum } from "@db/models/model-types";
// personal-site
import PS_PhotoList from "./personal-site/PhotoList";
import PS_VideoPlayer from "./personal-site/VideoPlayer";
import PS_HeadlineOnlyCTA from "./personal-site/HeadlineOnlyCTA";
import PS_TextBlock from "./personal-site/TextBlock";
import PS_PDFView from "./personal-site/PDFView";
import PS_PDFList from "./personal-site/PDFList";
import PS_PatronProdList from "./personal-site/PatronProdList";
import PS_BookCoverCTA from "./personal-site/BookCoverCTA";
import PS_About from "./personal-site/About";
import PS_OneTimePatrons from "./personal-site/OneTimePatrons";
import PS_EmbedComp from './personal-site/Embed';
// developer-portfolio
import DP_PhotoList from "./developer-portfolio/PhotoList";
import DP_VideoPlayer from "./developer-portfolio/VideoPlayer";
import DP_HeadlineOnlyCTA from "./developer-portfolio/HeadlineOnlyCTA";
import DP_TextBlock from "./developer-portfolio/TextBlock";
import DP_PDFView from "./developer-portfolio/PDFView";
import DP_PDFList from "./developer-portfolio/PDFList";
import DP_PatronProdList from "./developer-portfolio/PatronProdList";
import DP_BookCoverCTA from "./developer-portfolio/BookCoverCTA";
import DP_About from "./developer-portfolio/About";
import DP_OneTimePatrons from "./developer-portfolio/OneTimePatrons";
import DP_EmbedComp from './developer-portfolio/Embed';

const TemplateMap: { [key: string]: { [key: string]: any} } = {
	'personal-site': {
		'PhotoList': PS_PhotoList,
		'VideoPlayer': PS_VideoPlayer,
		'TextBlock': PS_TextBlock,
		'HeadlineOnlyCTA': PS_HeadlineOnlyCTA,
		'PDFList': PS_PDFList,
		'PDFView': PS_PDFView,
		'PatronProdList': PS_PatronProdList,
		'BookCoverCTA': PS_BookCoverCTA,
		'About': PS_About,
		'OneTimePatrons': PS_OneTimePatrons,
		'Embed': PS_EmbedComp
	},
	'developer-portfolio': {
		'PhotoList': DP_PhotoList,
		'VideoPlayer': DP_VideoPlayer,
		'TextBlock': DP_TextBlock,
		'HeadlineOnlyCTA': DP_HeadlineOnlyCTA,
		'PDFList': DP_PDFList,
		'PDFView': DP_PDFView,
		'PatronProdList': DP_PatronProdList,
		'BookCoverCTA': DP_BookCoverCTA,
		'About': DP_About,
		'OneTimePatrons': DP_OneTimePatrons,
		'Embed': DP_EmbedComp
	}
}

export default TemplateMap;