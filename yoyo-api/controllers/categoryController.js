const Category = require('../models/CategoryModel');
const asyncHandler = require('express-async-handler');

// create category
const createCategory = asyncHandler(async (req, res) => {
	const { name } = req.body;

	const categoryExists = await Category.findOne({ name });
	if (categoryExists) {
		throw new Error('Category already exist');
	} else {
		const category = await Category.create({
			name: name.toLowerCase(),
			user: req.userId,
			image: req.file.path,
		});
		res.status(201).json({
			status: 'success',
			message: 'Category created successfully',
			category,
		});
	}
});

// get all categories
const getAllCategories = asyncHandler(async (req, res) => {
	const categories = await Category.find({});
	res.status(200).json({
		status: 'success',
		message: 'Category found successfully',
		categories,
	});
});

// get single category
const getCategory = asyncHandler(async (req, res) => {
	const category = await Category.findById(req.params.id);
	res.status(200).json({
		status: 'success',
		message: 'Category found successfully',
		category,
	});
});

// update category
const updateCategory = asyncHandler(async (req, res) => {
	const updateCategory = await Category.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!updateCategory) {
		throw new Error('category not found');
	}

	res.json({
		status: 'success',
		message: 'category updated successfully',
		updateCategory,
	});
});

// delete category
const deleteCategory = asyncHandler(async (req, res) => {
	const category = await Category.findByIdAndDelete(req.params.id);
	if (!category) {
		throw new Error('Category not found');
	}
	res.json({
		status: 'success',
		message: 'Category deleted successfully',
	});
});

module.exports = { createCategory, getAllCategories, getCategory, updateCategory, deleteCategory };
