const Review = require('../models/ReviewModel');
const asyncHandler = require('express-async-handler');
const Product = require('../models/ProductModel');

const createReview = asyncHandler(async (req, res) => {
	//destructuring product, message and rating from request body
	const { product, message, rating } = req.body;
	//destructuring productID from params
	const { productID } = req.params;
	// check if the product exists
	const productExists = await Product.findById(productID).populate('reviews');
	if (!productExists) {
		throw new Error('Product not found');
	}
	// check if the product has been reviewed by the user
	const reviewed = productExists?.reviews.find((review) => {
		return review?.user?.toString() === req?.userId?.toString();
	});

	if (reviewed) {
		throw new Error('You have already reviewed this product');
	}
	//create review
	const review = await Review.create({
		user: req.userId,
		product: productExists?._id,
		message,
		rating,
	});

	// add review to product
	productExists.reviews.push(review?._id);

	// save new review
	await productExists.save();

	res.status(201).json({
		message: 'Review created successfully',
	});
});

module.exports = { createReview };
