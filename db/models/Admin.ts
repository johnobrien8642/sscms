import mongoose, { Schema, Model } from 'mongoose';

export type AdminType = {
	name: string;
	email: string;
	editorTheme: string;
};

const adminSchema = new Schema({
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		editorTheme: {
			type: String,
			default: 'Monokai',
			required: true
		}
	}
);

const Admin = mongoose.models.Admin || mongoose.model<AdminType>('Admin', adminSchema, 'admins');

export default Admin
