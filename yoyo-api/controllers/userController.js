const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
//import user model
const User = require('../models/UserModel');
const generateJwt = require('../utils/generateJwt');

// register a new user
const registerUser = asyncHandler(async (req, res) => {
	const { fullname, email, password } = req.body;

	//check if user exist
	const userExist = await User.findOne({ email });
	if (userExist) {
		throw new Error('User already exist');
	}

	//hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	//if user does not exist, create a new user
	const user = await User.create({
		fullname,
		email,
		password: hashedPassword,
	});

	return res.status(201).json({
		status: 'success',
		message: 'User Registered Successfully',
		data: user,
	});
});

// login a user
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!password) {
		res.status(400).json({
			status: 'fail',
			message: 'Password is required for login',
		});
	}

	//check if user exist
	const userFound = await User.findOne({ email });
	if (userFound && (await bcrypt.compare(password, userFound?.password))) {
		res.status(200).json({
			status: 'success',
			message: 'User Logged in Successfully',
			userFound,
			token: await generateJwt(userFound?._id),
		});
	} else {
		throw new Error('Invalid email or password');
	}
});

// get user profile
const getUserProfile = asyncHandler(async (req, res) => {
	//fine user and add orders to user
	const user = await User.findById(req.userId).populate('orders');

	res.status(200).json({
		status: 'success',
		message: 'Welcome to your profile',
		user,
	});
});

const updateShippingAddress = asyncHandler(async (req, res) => {
	const { firstName, lastName, address, city, postalCode, state, phone, country } = req.body;
	const user = await User.findByIdAndUpdate(
		req.userId,
		{
			shippingAddress: {
				firstName,
				lastName,
				address,
				city,
				postalCode,
				state,
				phone,
				country,
			},
			hasShippingAddress: true,
		},
		{
			new: true,
			runValidators: true,
		}
	);
	//send response
	res.json({
		status: 'success',
		message: 'User shipping address updated successfully',
		user,
	});
});

module.exports = {
	registerUser,
	loginUser,
	getUserProfile,
	updateShippingAddress,
};
