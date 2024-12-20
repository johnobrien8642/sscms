import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '@db/lib/mongodb';
import models from '@db/lib/index';
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
		schema, 
		nestedItemIds, 
		itemType, 
		skipAvailableItems, 
		skip, 
		limit 
	} = req.query;
	const nestedItemIdsArr = nestedItemIds ? (nestedItemIds as string).split(',') : [];
	let availableItemsFilter: any = {
		_id: { $nin: nestedItemIdsArr }
	};
	let availableItems: any = [];
	let availableItemsCount = 0;
	if (itemType) {
		availableItemsFilter.type = itemType;
	}
	const chosenItems = 
		await models[schema as string]
			.find({ _id: { $in: nestedItemIdsArr } }).sort('itemOrder createdAt');
	if (skipAvailableItems !== 'true') {
		availableItems = 
			await models[schema as string]
				.find(availableItemsFilter)
				.skip(parseInt(skip as string))
				.limit(parseInt(limit as string))
				.sort('createdAt');
		availableItemsCount = 
			await models[schema as string]
				.countDocuments(availableItemsFilter);
	}
	const orderedChosenItems = new Array(chosenItems.length);
	let item;
	for (let i = 0; i < chosenItems.length; i++) {
		item = chosenItems[i];
		orderedChosenItems.splice(nestedItemIdsArr.indexOf(item._id.toString()), 1, item)
	}
	return res.status(200).json({ 
		fetchedAvailableItems: availableItems, 
		fetchedChosenItems: orderedChosenItems, 
		availableItemsCount
	});
};