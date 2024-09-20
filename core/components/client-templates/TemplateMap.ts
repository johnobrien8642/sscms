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
import PS_BlogList from './personal-site/BlogList';
import PS_BlogDetail from "./personal-site/BlogDetail";
import PS_SideBySide from './personal-site/SideBySide';
// miserable-nomad
import MN_PhotoList from "./miserable-nomad/PhotoList";
import MN_VideoPlayer from "./miserable-nomad/VideoPlayer";
import MN_HeadlineOnlyCTA from "./miserable-nomad/HeadlineOnlyCTA";
import MN_TextBlock from "./miserable-nomad/TextBlock";
import MN_PDFView from "./miserable-nomad/PDFView";
import MN_PDFList from "./miserable-nomad/PDFList";
import MN_PatronProdList from "./miserable-nomad/PatronProdList";
import MN_BookCoverCTA from "./miserable-nomad/BookCoverCTA";
import MN_About from "./miserable-nomad/About";
import MN_OneTimePatrons from "./miserable-nomad/OneTimePatrons";
import MN_EmbedComp from './miserable-nomad/Embed';
import MN_BlogList from './miserable-nomad/BlogList';
import MN_SideBySide from './miserable-nomad/SideBySide';
import MN_SinglePhotoHighlight from './miserable-nomad/SinglePhotoHighlight';
import MN_BlogDetail from "./miserable-nomad/BlogDetail";
// house-lorenz-press
import HLP_PhotoList from "./house-lorenz-press/PhotoList";
import HLP_VideoPlayer from "./house-lorenz-press/VideoPlayer";
import HLP_HeadlineOnlyCTA from "./house-lorenz-press/HeadlineOnlyCTA";
import HLP_TextBlock from "./house-lorenz-press/TextBlock";
import HLP_PDFView from "./house-lorenz-press/PDFView";
import HLP_PDFList from "./house-lorenz-press/PDFList";
import HLP_PatronProdList from "./house-lorenz-press/PatronProdList";
import HLP_BookCoverCTA from "./house-lorenz-press/BookCoverCTA";
import HLP_About from "./house-lorenz-press/About";
import HLP_OneTimePatrons from "./house-lorenz-press/OneTimePatrons";
import HLP_EmbedComp from './house-lorenz-press/Embed';
import HLP_BlogList from './house-lorenz-press/BlogList';
import HLP_SideBySideTextBlock from './house-lorenz-press/SideBySideTextBlock';
import HLP_SideBySideHighlight from './house-lorenz-press/SideBySideHighlight';
import HLP_SinglePhotoHighlight from './house-lorenz-press/SinglePhotoHighlight';
import HLP_BlogDetail from "./house-lorenz-press/BlogDetail";
import HLP_ContactCard from "./house-lorenz-press/ContactCard";
import HLP_SubscribeForm from "./house-lorenz-press/SubscribeForm";
// blue-grey-card-theory
import BGCT_PhotoList from "./blue-grey-card-theory/PhotoList";
import BGCT_VideoPlayer from "./blue-grey-card-theory/VideoPlayer";
import BGCT_HeadlineOnlyCTA from "./blue-grey-card-theory/HeadlineOnlyCTA";
import BGCT_TextBlock from "./blue-grey-card-theory/TextBlock";
import BGCT_PDFView from "./blue-grey-card-theory/PDFView";
import BGCT_PDFList from "./blue-grey-card-theory/PDFList";
import BGCT_PatronProdList from "./blue-grey-card-theory/PatronProdList";
import BGCT_BookCoverCTA from "./blue-grey-card-theory/BookCoverCTA";
import BGCT_About from "./blue-grey-card-theory/About";
import BGCT_OneTimePatrons from "./blue-grey-card-theory/OneTimePatrons";
import BGCT_EmbedComp from './blue-grey-card-theory/Embed';
import BGCT_BlogList from './blue-grey-card-theory/BlogList';
import BGCT_SideBySide from './blue-grey-card-theory/SideBySide';
import BGCT_SinglePhotoHighlight from './blue-grey-card-theory/SinglePhotoHighlight';
import BGCT_BlogDetail from "./blue-grey-card-theory/BlogDetail";
// developer-portfolio
import DP_PhotoList from "./developer-portfolio/PhotoList";
import DP_VideoPlayer from "./developer-portfolio/VideoPlayer";
import DP_HeadlineOnlyCTA from "./developer-portfolio/HeadlineOnlyCTA";
import DP_TextBlock from "./developer-portfolio/TextBlock";
import DP_PDFView from "./developer-portfolio/PDFView";
import DP_PDFList from "./developer-portfolio/PDFList";
import DP_PatronProdList from "./developer-portfolio/PatronProdList";
import DP_Experience from "./developer-portfolio/Experience";
import DP_About from "./developer-portfolio/About";
import DP_LinkList from "./developer-portfolio/LinkList";
import DP_BlogDetail from "./developer-portfolio/BlogDetail";

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
		'Embed': PS_EmbedComp,
		'BlogList': PS_BlogList,
		'BlogDetail': PS_BlogDetail,
		'SideBySide': PS_SideBySide
	},
	'miserable-nomad': {
		'PhotoList': MN_PhotoList,
		'VideoPlayer': MN_VideoPlayer,
		'TextBlock': MN_TextBlock,
		'HeadlineOnlyCTA': MN_HeadlineOnlyCTA,
		'PDFList': MN_PDFList,
		'PDFView': MN_PDFView,
		'PatronProdList': MN_PatronProdList,
		'BookCoverCTA': MN_BookCoverCTA,
		'About': MN_About,
		'OneTimePatrons': MN_OneTimePatrons,
		'Embed': MN_EmbedComp,
		'BlogList': MN_BlogList,
		'SinglePhotoHighlight': MN_SinglePhotoHighlight,
		'SideBySide': MN_SideBySide,
		'BlogDetail': MN_BlogDetail
	},
	'house-lorenz-press': {
		'PhotoList': HLP_PhotoList,
		'VideoPlayer': HLP_VideoPlayer,
		'TextBlock': HLP_TextBlock,
		'HeadlineOnlyCTA': HLP_HeadlineOnlyCTA,
		'PDFList': HLP_PDFList,
		'PDFView': HLP_PDFView,
		'PatronProdList': HLP_PatronProdList,
		'BookCoverCTA': HLP_BookCoverCTA,
		'About': HLP_About,
		'OneTimePatrons': HLP_OneTimePatrons,
		'Embed': HLP_EmbedComp,
		'BlogList': HLP_BlogList,
		'SinglePhotoHighlight': HLP_SinglePhotoHighlight,
		'SideBySideTextBlock': HLP_SideBySideTextBlock,
		'SideBySideHighlight': HLP_SideBySideHighlight,
		'BlogDetail': HLP_BlogDetail,
		'ContactCard': HLP_ContactCard,
		'SubscribeForm': HLP_SubscribeForm,
	},
	'blue-grey-card-theory': {
		'PhotoList': BGCT_PhotoList,
		'VideoPlayer': BGCT_VideoPlayer,
		'TextBlock': BGCT_TextBlock,
		'HeadlineOnlyCTA': BGCT_HeadlineOnlyCTA,
		'PDFList': BGCT_PDFList,
		'PDFView': BGCT_PDFView,
		'PatronProdList': BGCT_PatronProdList,
		'BookCoverCTA': BGCT_BookCoverCTA,
		'About': BGCT_About,
		'OneTimePatrons': BGCT_OneTimePatrons,
		'Embed': BGCT_EmbedComp,
		'BlogList': BGCT_BlogList,
		'SinglePhotoHighlight': BGCT_SinglePhotoHighlight,
		'SideBySide': BGCT_SideBySide,
		'BlogDetail': BGCT_BlogDetail
	},
	'developer-portfolio': {
		'PhotoList': DP_PhotoList,
		'VideoPlayer': DP_VideoPlayer,
		'TextBlock': DP_TextBlock,
		'HeadlineOnlyCTA': DP_HeadlineOnlyCTA,
		'PDFList': DP_PDFList,
		'PDFView': DP_PDFView,
		'PatronProdList': DP_PatronProdList,
		'Experience': DP_Experience,
		'About': DP_About,
		'LinkList': DP_LinkList,
		'BlogDetail': DP_BlogDetail
	}
}

export default TemplateMap;