import Admin from '../models/Admin';
import Page from '../models/Page';
import PageManager from '../models/PageManager';
import Templates from '../models/Templates';
import Assets from '../models/Assets';
import BlogPost from '../models/BlogPost';
import mongoose from 'mongoose';

const models: { [key: string]: typeof mongoose.Model } = {
	Admin,
	Page,
	PageManager,
	Templates,
	Assets,
	BlogPost
};

export default models;
