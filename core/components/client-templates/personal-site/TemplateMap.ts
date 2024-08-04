import React from "react";
import { TemplatesEnum } from "@db/models/model-types";
import PhotoList from "./PhotoList";
import VideoPlayer from "./VideoPlayer";
import HeadlineOnlyCTA from "./HeadlineOnlyCTA";
import TextBlock from "./TextBlock";
import PDFView from "./PDFView";
import PDFList from "./PDFList";
import PatronProdList from "./PatronProdList";
import BookCoverCTA from "./BookCoverCTA";
import About from "./About";
import OneTimePatrons from "./OneTimePatrons";
import EmbedComp from './Embed';

const TemplateMap: { [key in TemplatesEnum]: any } = {
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