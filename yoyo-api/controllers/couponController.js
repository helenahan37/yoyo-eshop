const Coupon = require('../models/CouponModel');
const asyncHandler = require('express-async-handler');

// create new coupon
const createCoupon = asyncHandler(async (req, res) => {
	const { code, startDate, endDate, discount } = req.body;
	// check if admin

	// check if coupon already exist
	const couponExists = await Coupon.findOne({ code });
	if (couponExists) {
		throw new Error('Coupon already exist');
	}
	// check discount is a number
	if (isNaN(discount)) {
		throw new Error('Discount must be a number');
	}
	// create coupon
	const coupon = await Coupon.create({
		code: code?.toUpperCase(),
		startDate,
		endDate,
		discount,
		user: req.userId,
	});
	res.status(200).json({
		status: 'success',
		message: 'Coupon created successfully',
		coupon,
	});
});

// get all coupons
const getAllCoupons = asyncHandler(async (req, res) => {
	const coupons = await Coupon.find();
	res.status(200).json({
		status: 'success',
		message: 'Coupons found successfully',
		coupons,
	});
});

//get coupon by id
const getCouponById = asyncHandler(async (req, res) => {
	const coupon = await Coupon.findById(req.params.id);
	res.status(200).json({
		status: 'success',
		message: 'Coupon found successfully',
		coupon,
	});
});

// update coupon
const updateCoupon = asyncHandler(async (req, res) => {
	const { code, startDate, endDate, discount } = req.body;
	updatedCoupon = await Coupon.findByIdAndUpdate(
		req.params.id,
		{
			code,
			startDate,
			endDate,
			discount,
		},
		{
			new: true,
			runValidators: true,
		}
	);
	res.status(200).json({
		status: 'success',
		message: 'Coupon updated successfully',
		updatedCoupon,
	});
});

// delete coupon
const deleteCoupon = asyncHandler(async (req, res) => {
	await Coupon.findByIdAndDelete(req.params.id);
	res.status(200).json({
		status: 'success',
		message: 'Coupon deleted successfully',
	});
});

module.exports = { createCoupon, getAllCoupons, getCouponById, updateCoupon, deleteCoupon };
