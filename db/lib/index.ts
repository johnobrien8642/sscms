import Admin from '../models/Admin';
import Page from '../models/Page';
import Templates from '../models/Templates';
import Assets from '../models/Assets';
import BlogPost from '../models/BlogPost';
import Settings from '../models/Settings';
import Text from '../models/Text';
import Draft from '../models/Draft';
import mongoose from 'mongoose';

const models: { [key: string]: typeof mongoose.Model } = {
	Admin,
	Page,
	Templates,
	Assets,
	BlogPost,
	Settings,
	Draft,
	Text
};

export default models;
