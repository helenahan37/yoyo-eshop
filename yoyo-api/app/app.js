const express = require('express');
const app = express();
const { globalErrorHandler, notFound } = require('../middlewares/globalErrorHandler');
require('dotenv').config();

const Stripe = require('stripe');

// create stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);
//stripe webhook

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = 'whsec_e266f1ceba106a3252f07c0d733c5cc66e962296c008264c7a28f997af231aae';

app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
	const sig = request.headers['stripe-signature'];

	let event;

	try {
		event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
		console.log('event');
	} catch (err) {
		response.status(400).send(`Webhook Error: ${err.message}`);
		return;
	}

	if (event.type === 'checkout.session.completed') {
		const session = event.data.object;
		// get orderId from session metadata
		const { orderId } = session.metadata;

		//get payment status
		const paymentStatus = session.payment_status;

		//get payment method
		const paymentMethod = session.payment_method_types[0];

		//get total amount
		const totalAmount = session.amount_total;

		//get currency
		const currency = session.currency;
		//update order
		const order = await Order.findByIdAndUpdate(
			JSON.parse(orderId),
			{
				totalPrice: totalAmount / 100,
				currency,
				paymentMethod,
				paymentStatus,
			},
			{
				new: true,
				runValidators: true,
			}
		);
		console.log(order);
	} else {
		return;
	}
	// Return a 200 response to acknowledge receipt of the event
	response.send();
});

// pass incoming request to express.json()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

const userRoutes = require('../routes/userRoute');
const productRoutes = require('../routes/productRoute');
const categoryRoutes = require('../routes/categoryRoute');
const brandRoutes = require('../routes/brandRoute');
const colorRoutes = require('../routes/colorRoute');
const reviewRoutes = require('../routes/reviewRoute');
const orderRoutes = require('../routes/orderRoute');
const couponRoutes = require('../routes/couponRoute');

app.get('/home', (req, res) => {
	res.send('Welcome to Yoyo online store 👋 ');
});
// routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/brands', brandRoutes);
app.use('/colors', colorRoutes);
app.use('/reviews', reviewRoutes);
app.use('/orders', orderRoutes);
app.use('/coupons', couponRoutes);

app.use(notFound);
// global error handler
app.use(globalErrorHandler);

module.exports = app;
