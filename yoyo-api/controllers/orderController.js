const Order = require('../models/OrderModel');
const User = require('../models/UserModel');
const Product = require('../models/ProductModel');
const Coupon = require('../models/CouponModel');
const asyncHandler = require('express-async-handler');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_KEY);
/*  
1. get the user who created the order
2. get the order details
3. check order not empty
4. place order and save to database
5. push order to user orders
6. update product quantity
7. make payment 
8. interact with payment webhook
9. update user order
*/
// create new order
const createOrder = asyncHandler(async (req, res) => {
	// get coupon
	const { coupon } = req.query;

	const couponExists = await Coupon.findOne({ code: coupon?.toUpperCase() });
	// check if coupon exist
	if (couponExists?.isExpired) {
		throw new Error('Coupon is expired');
	}
	if (!couponExists) {
		throw new Error('Coupon not found');
	}
	//get discount
	const discount = couponExists?.discount / 100;

	// get order details from request body
	const { orderItems, shippingAddress, totalPrice } = req.body;

	// get user id from request
	const user = await User.findById(req.userId);

	//check if order is empty
	if (orderItems?.length <= 0) {
		throw new Error('Order is empty');
	}
	// create new order
	const order = await Order.create({
		user: user?._id,
		orderItems,
		shippingAddress,
		totalPrice: couponExists ? totalPrice - totalPrice * discount : totalPrice,
	});
	console.log(order);
	// check if user has shipping address
	// if it false, then throw error
	if (!user?.hasShippingAddress) {
		throw new Error('Please provide your shipping address');
	}

	//add order into user and save
	user.orders.push(order?._id);
	await user.save();

	//find the total id in orderItems
	const products = await Product.find({ _id: { $in: orderItems } });

	orderItems?.map(async (order) => {
		// find product id inside order
		const product = products?.find((product) => {
			//convert object id to string
			return product?._id?.toString() === order?._id?.toString();
		});

		if (product) {
			// update product quantity
			product.totalSold += order.quantity;
		}
		await product.save();
	});

	// make payment

	// convert order to stripe structure
	const convertOrders = orderItems.map((order) => {
		return {
			price_data: {
				currency: 'usd',
				product_data: {
					name: order?.name,
					description: order?.description,
				},
				unit_amount: order?.price * 100,
			},
			quantity: order?.quantity,
		};
	});
	//create session
	const session = await stripe.checkout.sessions.create({
		line_items: convertOrders,
		metadata: {
			orderId: JSON.stringify(order?._id),
		},
		// one time payment
		mode: 'payment',
		success_url: 'http://localhost:3000/success',
		cancel_url: 'http://localhost:3000/cancel',
	});

	res.send({ url: session.url });
});

// get all orders
const getAllOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({});
	res.status(200).json({
		status: 'success',
		message: 'All orders',
		orders,
	});
});

//get order by id
const getOrder = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);
	res.status(200).json({
		status: 'success',
		message: 'Order found',
		order,
	});
});

//update order to delivery
const updateOrder = asyncHandler(async (req, res) => {
	// fine the order by id
	const order = await Order.findById(req.params.id);
	// update order
	const updatedOrder = await Order.findByIdAndUpdate(
		order,
		{
			status: req.body.status,
		},
		{
			new: true,
			runValidators: true,
		}
	);
	res.status(200).json({
		status: 'success',
		message: 'Order updated',
		updatedOrder,
	});
});

//pipeline
//get all sales orders' pirce
const salesOrdersPrice = asyncHandler(async (req, res) => {
	// get sales
	// create aggregation pipeline
	const totalSales = await Order.aggregate([
		{
			$group: {
				_id: null,
				totalSales: {
					$sum: '$totalPrice',
				},
			},
		},
	]);

	res.status(200).json({
		status: 'success',
		message: 'All sales orders price',
		totalSales,
	});
});

//get orders stats
const orderStats = asyncHandler(async (req, res) => {
	// get order stats
	// create aggregation pipeline
	const getorderStatus = await Order.aggregate([
		{
			$group: {
				_id: null,
				totalSale: {
					$sum: '$totalPrice',
				},
				minimulSale: {
					$min: '$totalPrice',
				},
				maxmumSale: {
					$max: '$totalPrice',
				},
				averSale: {
					$avg: '$totalPrice',
				},
			},
		},
	]);
	// get today's date
	const date = new Date();
	const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	//get today's sales
	const salesToday = await Order.aggregate([
		{
			$match: {
				createdAt: {
					$gte: today,
				},
			},
		},
		{
			$group: {
				_id: null,
				totalSales: {
					$sum: '$totalPrice',
				},
			},
		},
	]);

	res.status(200).json({
		status: 'success',
		message: 'All sales orders price',
		getorderStatus,
		salesToday,
	});
});

module.exports = { createOrder, getAllOrders, getOrder, updateOrder, salesOrdersPrice, orderStats };
