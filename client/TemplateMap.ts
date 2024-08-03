import React from "react";
import PhotoList from "@client/components/templates/PhotoList";
import VideoPlayer from "@client/components/templates/VideoPlayer";
import HeadlineOnlyCTA from "@client/components/templates/HeadlineOnlyCTA";
import TextBlock from "@client/components/templates/TextBlock";
import PDFView from "@client/components/templates/PDFView";
import PDFList from "@client/components/templates/PDFList";
import PatronProdList from "@client/components/templates/PatronProdList";
import BookCoverCTA from "@client/components/templates/BookCoverCTA";
import About from "@client/components/templates/About";
import OneTimePatrons from "@client/components/templates/OneTimePatrons";
import EmbedComp from '@client/components/templates/Embed';

const TemplateMap: { [key: string]: any } = {
	'PhotoList': PhotoList,
	'VideoPlayer': VideoPlayer,
	'TextBlock': TextBlock,
	'HeadlineOnlyCTA': HeadlineOnlyCTA,
	'PDFList': PDFList,
	'PDFView': PDFView,
	'PatronProdList': PatronProdList,
	'BookCoverCTA': BookCoverCTA,
	'About': About,
	'OneTimePatrons': OneTimePatrons,
	'Embed': EmbedComp
}

export default TemplateMap;