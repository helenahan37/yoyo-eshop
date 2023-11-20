//coupon model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CouponSchema = new Schema(
	{
		code: {
			type: String,
			required: true,
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},
		discount: {
			type: Number,
			required: true,
			default: 0,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
	}
);

//coupon if coupon is expired or not
CouponSchema.virtual('isExpired').get(function () {
	return this.endDate < Date.now();
});

// check how many days left for coupon to expire
CouponSchema.virtual('daysLeft').get(function () {
	const daysLeft = Math.ceil((this.endDate - Date.now()) / (1000 * 60 * 60 * 24)) + ' days left';
	return daysLeft;
});

//date validation middleware
CouponSchema.pre('validate', function (next) {
	if (this.endDate < this.startDate) {
		next(new Error('End date must be greater than start date'));
	}
	next();
});

CouponSchema.pre('validate', function (next) {
	if (this.startDate < Date.now()) {
		next(new Error('Start date must be greater than current date'));
	}
	next();
});

CouponSchema.pre('validate', function (next) {
	if (this.endDate < Date.now()) {
		next(new Error('End date must be greater than current date'));
	}
	next();
});

// discount validation middleware
CouponSchema.pre('validate', function (next) {
	if (this.discount <= 0 || this.discount > 100) {
		next(new Error('Discount must be between 0 and 100'));
	}
	next();
});

const Coupon = mongoose.model('Coupon', CouponSchema);
module.exports = Coupon;
