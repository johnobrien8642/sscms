import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '@db/lib/mongodb';
import models from '@db/lib/index';
import Page, { PageType } from '@db/models/Page';
import { isEqual } from 'lodash';
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}

export function deleteAdminFields(data: any) {
	delete data.previous;
	delete data.formTitle;
	delete data.update;
	delete data.parentFieldTitle;
	delete data.saveDraft;
	delete data.updateAllDraftsForPublish;
	delete data.publishedBeingDrafted;
	delete data.draftForId;
	delete data.doesNotDraft;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await connectDb();
	const {
		data,
		folderHref,
		pageManagerKey,
		revalidateAll
		// update,
		// itemToEditId,
		// parentId
	} = req.body
	let item;
	let parentItem;
	let itemExistsAlready;
	let formOrderDoc: any;
	let pageManager;
	let parentFieldTitleRef = data.parentFieldTitle;
	let formTitleRef = data.formTitle;
	if (req.method === 'POST') {
		if (formTitleRef === 'Page') {
			itemExistsAlready = await Page.findOne({ folderHref: data.folderHref });
			formOrderDoc = await Page.find({}).sort('-formOrder').limit(1).select('formOrder');
			data.formOrder = formOrderDoc.length ? formOrderDoc[0].formOrder + 1 : 0;
			// console.log(data)
			if (itemExistsAlready) {
				return res.status(400).json({ success: false, errorMessage: `Page with folderHref: ${data.folderHref} already exists` });
			}
		}
		if (data.previous) {
			parentItem = await models[formTitleRef].findById(data.previous);
			if (parentItem) {
				parentItem[data.parentFieldTitle].push(data._id);
				if (parentItem.schemaName === formTitleRef) {
					data.isNestedChild = true;
				}
				if (data.formTitle === 'Page') {
					data.folderHref = (parentItem.folderHref === '/' ? '' : parentItem.folderHref) + data.folderHref;
				}
				await parentItem.save();
			}
		}
		try {
			deleteAdminFields(data);
			item = new models[formTitleRef]({
				...data
			});
			item.itemOrder = 
				parentItem?.[data?.parentFieldTitle] ? 
					parentItem[data.parentFieldTitle].length + 1 : 0;
			const savedItem = await item.save();
			return res.status(200).json({ success: true, _id: savedItem._id, parent: parentItem, parentFieldTitleRef, savedItem });
		} catch (err: any) {
			return res.status(500).json({ success: false, errorMessage: err.message });
		}
	} else if (req.method === 'PUT') {
		const _id = data._id;
		const draftForId = data.draftForId;
		const saveDraft = data.saveDraft;
		const doesNotDraft = data.doesNotDraft;
		delete data._id;
		try {
			item = await models[formTitleRef].findById(_id);
			parentItem = await models[formTitleRef].findById(data.previous);
			if (parentItem && parentItem.schemaName === formTitleRef && formTitleRef === 'Page') {
				data.folderHref = (parentItem.folderHref === '/' ? '' : parentItem.folderHref) + data.folderHref;
			}
			try {
				await res.revalidate(folderHref);
			} catch (err) {
			}
			if (revalidateAll) {
				const allPages = 
					await models['Page']
						.find({}).select('folderHref');
				const allBlogPosts = 
					await models['BlogPost']
						.find({}).select('folderHref');
				const allItems = [...allPages, ...allBlogPosts];
				for (let i = 0; i < allItems.length; i++) {
					await res.revalidate(allItems[i].folderHref);
				}
			}
			const draftFor = await models[formTitleRef].findOne({ _id: draftForId });
			const modelPaths = models[data.schemaName as string].schema.paths;
			for (const key in modelPaths) {
				if (draftFor) {
					if (modelPaths[key].options.updateAllDrafts && !isEqual(draftFor[key], data[key])) {
						await models[formTitleRef].updateMany({
							[key]: draftFor[key]
						}, {
							[key]: data[key]
						})
					}
				}
				if (modelPaths[key].instance === 'Array') {
					for (let i = 0; i < data[key].length; i++) {
						await models[
							//@ts-ignore
							modelPaths[key].caster.options.ref
						].findOneAndUpdate({ _id: data[key][i] }, { itemOrder: i });
					}
				}
			}
			if (data.updateAllDraftsForPublish) {
				await models[data.schemaName as string]
					.updateMany(
						{ 
							_id: { $ne: data._id },
							folderHref: data.folderHref
						}, 
						{
							isPublished: false,
							isActiveDraft: false
						}
					)
			}
			deleteAdminFields(data);
			function resolveId() {
				if (saveDraft || doesNotDraft || !draftForId) {
					return _id;
				} else {
					return draftForId;
				}
			};
			await models[formTitleRef].findOneAndUpdate(
				{ _id: resolveId() },
				{
					...data,
					updatedAt: new Date()
				}
			);
			if (!saveDraft && !doesNotDraft && (formTitleRef === 'Page' || formTitleRef === 'BlogPost')) {
				await models[formTitleRef].deleteOne({ _id: _id });
			}
			return res.status(200).json({ success: true, _id: _id, parent: parentItem, parentFieldTitleRef, savedItem: { _id: _id } });
		} catch (err: any) {
			return res.status(500).json({ success: false, errorMessage: err.message });
		}
	}
};
