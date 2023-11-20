const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		fullname: {
			type: String,
			required: [true, 'Fullname is required'],
		},
		email: {
			type: String,
			required: [true, 'Please provide your email'],
			unique: true,
			lowercase: true,
			validate: [validator.isEmail, 'Please provide a valid email'],
		},
		password: {
			type: String,
			required: [true, 'Please provide a password'],
			minlength: 8,
		},
		orders: [
			{
				type: mongoose.Schema.Types.ObjectId,
				//ref order model
				ref: 'Order',
			},
		],
		wishLists: [
			{
				type: mongoose.Schema.Types.ObjectId,
				//ref wishlist model
				ref: 'WishList',
			},
		],
		isAdmin: {
			type: Boolean,
			default: false,
		},
		hasShippingAddress: {
			type: Boolean,
			default: false,
		},
		shippingAddress: {
			firstName: {
				type: String,
			},
			lastName: {
				type: String,
			},
			address: {
				type: String,
			},
			city: {
				type: String,
			},
			postCode: {
				type: String,
			},
			state: {
				type: String,
			},
			country: {
				type: String,
			},
			phone: {
				type: String,
			},
		},
	},
	//date of creation and date of update
	{
		timestamps: true,
	}
);

//compile model from schema
const User = mongoose.model('User', UserSchema);

module.exports = User;
