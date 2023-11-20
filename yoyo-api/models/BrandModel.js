//category schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BrandSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		image: {
			type: String,
			required: true,
			default: 'http://picsum.photos/200/300',
		},
		products: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
			},
		],
	},
	{ timestamps: true }
);

const Brand = mongoose.model('Brand', BrandSchema);

module.exports = Brand;
