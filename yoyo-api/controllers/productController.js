const asyncHandler = require('express-async-handler');
const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');
const Brand = require('../models/BrandModel');

// create a new product
const createProduct = asyncHandler(async (req, res) => {
	const convertedImgs = req.files.map((file) => file.path);

	const { name, description, brand, price, category, sizes, colors, totalQty } = req.body;

	//check if product exist
	const productExists = await Product.findOne({ name: name.toLowerCase() });
	if (productExists) {
		throw new Error('Product already exist');
	}
	//check if brand exist
	const brandFound = await Brand.findOne({ name: brand?.toLowerCase() });
	if (!brandFound) {
		throw new Error('Brand not found, please check the name or add brand first');
	}
	//check if category exist
	const categoryFound = await Category.findOne({ name: category.toLowerCase() });
	if (!categoryFound) {
		throw new Error('Category not found, please check the name or add category first');
	}

	// add product
	const product = await Product.create({
		name,
		description,
		brand,
		price,
		category,
		sizes,
		colors,
		user: req.userId,
		totalQty,
		images: convertedImgs,
	});

	// add product to category
	categoryFound.products.push(product._id);

	await categoryFound.save();

	// add product to brand
	brandFound.products.push(product._id);

	await brandFound.save();

	res.status(201).json({
		status: 'success',
		message: 'Product created successfully',
		product,
	});
});

//get all products
const getAllProducts = asyncHandler(async (req, res) => {
	// query products
	let productQuery = Product.find();

	// search product by name
	// match name with regex and case insensitive

	if (req.query.name) {
		productQuery = productQuery.find({ name: { $regex: req.query.name, $options: 'i' } });
	}
	// search product by brand
	if (req.query.brand) {
		productQuery = productQuery.find({ brand: { $regex: req.query.brand, $options: 'i' } });
	}
	// search product by category
	if (req.query.category) {
		productQuery = productQuery.find({ category: { $regex: req.query.category, $options: 'i' } });
	}
	// search product by color
	if (req.query.colors) {
		productQuery = productQuery.find({ colors: { $regex: req.query.colors, $options: 'i' } });
	}
	// search product by sizes
	if (req.query.sizes) {
		productQuery = productQuery.find({ sizes: { $regex: req.query.sizes, $options: 'i' } });
	}
	// search product by price range
	if (req.query.price) {
		//split the price range
		const priceRange = req.query.price.split('-');
		//query the price range greater than or equal to the first value and less than or equal to the second value
		productQuery = productQuery.find({ price: { $gte: priceRange[0], $lte: priceRange[1] } });
	}

	//pagination
	// if user do not specify page number, default to 1
	const page = parseInt(req.query.page) || 1;
	// if user do not specify limit, default to 10 records per page
	const limit = parseInt(req.query.limit) || 10;
	// start index
	const startIndex = (page - 1) * limit;
	// end index
	const endIndex = page * limit;
	// get the total number of products
	const total = await Product.countDocuments();
	// pagination result
	productQuery = productQuery.skip(startIndex).limit(limit);

	const pagination = {};
	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}
	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}

	const products = await productQuery.populate('reviews');

	res.json({
		status: 'success',
		total,
		results: products.length,
		pagination,
		products,
	});
});

//get single product
const getProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id).populate('reviews');
	if (!product) {
		throw new Error('Product not found');
	} else {
		res.json({
			status: 'success',
			product,
		});
	}
});

// update product
const updateProduct = asyncHandler(async (req, res) => {
	// const { name, description, category, sizes, colors, user, price, totalQty, brand } = req.body;

	const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!product) {
		throw new Error('Product not found');
	}

	res.json({
		status: 'success',
		message: 'Product updated successfully',
		product,
	});
});

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findByIdAndDelete(req.params.id);
	if (!product) {
		throw new Error('Product not found');
	}
	res.json({
		status: 'success',
		message: 'Product deleted successfully',
	});
});

module.exports = { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct };
