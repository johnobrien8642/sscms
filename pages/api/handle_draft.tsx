import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '@db/lib/mongodb';
import models from '@db/lib/index';
import Page, { PageType } from '@db/models/Page';
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await connectDb();
	const {
		data,
		unmountedDeleteLast,
		folderHref,
		pageManagerKey,
		revalidateAll
		// update,
		// itemToEditId,
		// parentId
	} = req.body;
	if (req.method === 'POST') {
		try {
			const draft = await handleDraft(data);
			return res.status(200).json({ success: true, draft });
		} catch(err: any) {
			return res.status(500).json({ success: false, draftSaved: false, error: err.message });
		}
	} else if (req.method === 'DELETE') {
		try {
			const draft = await handleDeleteDraft(data, models);
			return res.status(200).json({ success: true, draft });
		} catch(err: any) {
			return res.status(500).json({ success: false, draftSaved: false, error: err.message });
		}
	}
}
async function handleDraft(dataObj: any) {
	const modelPaths = models[dataObj.schemaName as string].schema.paths;
	for (const key in dataObj) {
		if (
			key === '_id' ||
			key === '__v' ||
			key === 'updatedAt' ||
			key === 'createdAt' ||
			key === 'publishedAt'
		) {
			delete dataObj[key];
		};
		if (typeof dataObj[key] === 'object') {
			delete dataObj[key]['_id'];
		};
		if (
			modelPaths[key]?.instance === 'Array' && 
				modelPaths[key]?.options.cloneForDraft
		) {
			const nestedDocArr = 
				//@ts-ignore
				await models[modelPaths[key].caster.options.ref]
					.find(
						{ _id: dataObj[key] }, 
						'-_id -updatedAt -createdAt'
					)
					.sort('itemOrder')
					.lean();
			let newIdArr = [];
			let newDoc: any;
			for (let i = 0; i < nestedDocArr.length; i++) {
				newDoc = await handleDraft(nestedDocArr[i]);
				newIdArr.push(newDoc._id);
			}
			dataObj[key] = newIdArr;
		};
	}
	return await models[dataObj.schemaName as string]
		.create({ 
			...dataObj, 
			isFirstDraft: false, 
			isActiveDraft: false, 
			isPublished: false,
			updatedAt: new Date(),
			createdAt: new Date()
		});
}
export async function handleDeleteDraft(dataObj: any, models: any) {
	const modelPaths = models[dataObj.schemaName as string].schema.paths;
	for (const key in dataObj) {
		if (
			modelPaths[key]?.instance === 'Array' && 
				modelPaths[key]?.options.cloneForDraft
		) {
			const nestedDocArr = 
				//@ts-ignore
				await models[modelPaths[key].caster.options.ref]
					.find({ _id: dataObj[key] }, '_id schemaName');
			for (let i = 0; i < nestedDocArr.length; i++) {
				await handleDeleteDraft(nestedDocArr[i], models);
			}
		};
	}
	return await models[dataObj.schemaName as string]
		.deleteOne({ _id: dataObj._id });
}
