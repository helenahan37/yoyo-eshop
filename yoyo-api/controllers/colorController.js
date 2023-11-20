const Color = require('../models/ColorModel');
const asyncHandler = require('express-async-handler');

// create color
const createColor = asyncHandler(async (req, res) => {
	const { name } = req.body;

	const colorExists = await Color.findOne({ name });
	if (colorExists) {
		throw new Error('Color already exist');
	} else {
		const color = await Color.create({
			name: name.toLowerCase(),
			user: req.userId,
		});
		res.status(201).json({
			status: 'success',
			message: 'Color created successfully',
			color,
		});
	}
});

// get all Colors
const getAllColors = asyncHandler(async (req, res) => {
	const colors = await Color.find({});
	res.status(200).json({
		status: 'success',
		message: 'Colors found successfully',
		colors,
	});
});

// get single Color
const getColor = asyncHandler(async (req, res) => {
	const color = await Color.findById(req.params.id);
	res.status(200).json({
		status: 'success',
		message: 'Color found successfully',
		color,
	});
});

// update Color
const updateColor = asyncHandler(async (req, res) => {
	const updateColor = await Color.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!updateColor) {
		throw new Error('Color not found');
	}

	res.json({
		status: 'success',
		message: 'Color updated successfully',
		updateColor,
	});
});

// delete Color
const deleteColor = asyncHandler(async (req, res) => {
	const color = await Color.findByIdAndDelete(req.params.id);
	if (!color) {
		throw new Error('Color not found');
	}
	res.json({
		status: 'success',
		message: 'Color deleted successfully',
	});
});

module.exports = { createColor, getAllColors, getColor, updateColor, deleteColor };
