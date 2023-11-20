const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		brand: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			ref: 'Category',
			required: true,
		},
		sizes: {
			type: [String],
			enum: ['S', 'M', 'L', 'XL', 'XXL'],
			required: true,
		},
		colors: {
			type: [String],
			required: true,
		},

		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},

		images: [
			{
				type: String,
				required: true,
			},
		],

		reviews: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Review',
			},
		],

		price: {
			type: Number,
			required: true,
		},

		totalQty: {
			type: Number,
			required: true,
		},
		totalSold: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{
		timestamps: true,

		// include virtual properties in the JSON representation
		toJSON: { virtuals: true },
	}
);

// Virtual property to get the average rating of a product
// Total rating
ProductSchema.virtual('totalReviews').get(function () {
	//this refers to single product
	const product = this;
	return product?.reviews?.length;
});

//total quantity left
ProductSchema.virtual('totalQtyLeft').get(function () {
	const product = this;
	return product?.totalQty - product?.totalSold;
});

// average rating
ProductSchema.virtual('averageRating').get(function () {
	let ratingsTotal = 0;

	const product = this;

	product?.reviews?.forEach((review) => {
		ratingsTotal += review?.rating;
	});

	//average rating with 1 decimal place
	const averageRating = Number(ratingsTotal / product?.reviews?.length).toFixed(1);
	return averageRating;
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
