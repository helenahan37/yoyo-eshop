const Brand = require('../models/BrandModel');
const asyncHandler = require('express-async-handler');

// create brand
const createBrand = asyncHandler(async (req, res) => {
	const { name } = req.body;

	const brandExists = await Brand.findOne({ name });
	if (brandExists) {
		throw new Error('Brand already exist');
	} else {
		const brand = await Brand.create({
			name: name.toLowerCase(),
			user: req.userId,
		});
		res.status(201).json({
			status: 'success',
			message: 'Brand created successfully',
			brand,
		});
	}
});

// get all brands
const getAllBrands = asyncHandler(async (req, res) => {
	const brands = await Brand.find({});
	res.status(200).json({
		status: 'success',
		message: 'Brands found successfully',
		brands,
	});
});

// get single brand
const getBrand = asyncHandler(async (req, res) => {
	const brand = await Brand.findById(req.params.id);
	res.status(200).json({
		status: 'success',
		message: 'Brand found successfully',
		brand,
	});
});

// update Brand
const updateBrand = asyncHandler(async (req, res) => {
	const updateBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!updateBrand) {
		throw new Error('Brand not found');
	}

	res.json({
		status: 'success',
		message: 'Brand updated successfully',
		updateBrand,
	});
});

// delete Brand
const deleteBrand = asyncHandler(async (req, res) => {
	const brand = await Brand.findByIdAndDelete(req.params.id);
	if (!brand) {
		throw new Error('Brand not found');
	}
	res.json({
		status: 'success',
		message: 'Brand deleted successfully',
	});
});

module.exports = { createBrand, getAllBrands, getBrand, updateBrand, deleteBrand };
