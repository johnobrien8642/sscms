import connectDb from '../../lib/mongodb.js';
import Assets from '../../models/Assets';
import { getPlaiceholder } from 'plaiceholder';
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}
export default async (req, res) => {
	await connectDb();

	if (req.method === 'POST') {
		const {
			data,
			update,
			itemToEditId
		} = req.body

		try {
			const src = process.env.NEXT_PUBLIC_CLOUDFRONT_URL + data.assetKey + '?q=1'
			const buffer = await fetch(src).then(async (res) =>
				Buffer.from(await res.arrayBuffer())
			);
			const { base64 } = await getPlaiceholder(buffer);
			let asset;
			if (update !== 'Assets') {
				asset = new Assets({
					...data,
					blurString: base64
				});
				try {
					const savedAsset = await asset.save();
					return res.status(200).json({ success: true, savedAssetId: savedAsset._id });
				} catch (err) {
					return res.status(500).json({ success: false, errorMessage: err.message });
				}
			} else {
				try {
					asset = await Assets.findOneAndUpdate(
						{ _id: itemToEditId },
						{
							...data,
							blurString: base64
						}
					)
					return res.status(200).json({ success: true, savedAssetId: asset._id });
				} catch (err) {
					return res.status(500).json({ success: false, errorMessage: err.message });
				}
			}
		} catch(err) {

		}


	}
};
