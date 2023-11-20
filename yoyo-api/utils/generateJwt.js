const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateJwt = async (id) => {
	return jwt.sign(
		// Payload
		{ id },
		// Secret key for server-only verification
		process.env.JWT_KEY,
		//expires in 7 days
		{ expiresIn: '7d' }
	);
};

module.exports = generateJwt;
