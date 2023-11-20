const getToken = require('../utils/getToken');
const verifyToken = require('../utils/verifyToken');

const checkLogin = (req, res, next) => {
	// get token from header
	const token = getToken(req);
	//verified the decoded token from token gotten from header
	const decodedUser = verifyToken(token);

	if (!decodedUser) {
		throw new Error('Invalid token, please login again ');
	} else {
		//save the user
		req.userId = decodedUser?.id;
		next();
	}
};

module.exports = checkLogin;
