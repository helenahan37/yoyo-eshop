const User = require('../models/UserModel');

const isAdmin = async (req, res, next) => {
	//find the user
	const user = await User.findById(req.userId);
	// check if user is admin
	if (user?.isAdmin) {
		next();
	} else {
		next(new Error('Admin access denied, admin only'));
	}
};

module.exports = isAdmin;
