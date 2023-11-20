const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const randomNumbers = require('../utils/generateRandomNumber');

const OrderSchema = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		orderItems: [
			{
				type: Object,
				required: true,
			},
		],
		shippingAddress: {
			type: Object,
			required: true,
		},
		orderNumber: {
			type: String,
			required: true,
			default: randomNumbers,
		},
		//for payment
		paymentStatus: {
			type: String,
			default: 'Not paid',
		},
		paymentMethod: {
			type: String,
			default: 'Not specified',
		},
		totalPrice: {
			type: Number,
			default: 0.0,
		},
		currency: {
			type: String,
			default: 'Not specified',
		},
		//For admin
		status: {
			type: String,
			default: 'pending',
			enum: ['pending', 'processing', 'shipped', 'delivered'],
		},
		deliveredAt: {
			type: Date,
		},
	},
	// date the order created
	{
		timestamps: true,
	}
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
