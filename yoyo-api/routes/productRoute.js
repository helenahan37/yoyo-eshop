const express = require('express');
const {
	createProduct,
	getAllProducts,
	getProduct,
	updateProduct,
	deleteProduct,
} = require('../controllers/productController');
const checkLogin = require('../middlewares/checkLogin');
const isAdmin = require('../middlewares/isAdmin');
const upload = require('../config/fileUpload');

const productRoutes = express.Router();

productRoutes
	.post('/', checkLogin, isAdmin, upload.array('files'), createProduct)
	.get('/', getAllProducts)
	.get('/:id', getProduct)
	.put('/:id', checkLogin, isAdmin, updateProduct)
	.delete('/:id', checkLogin, isAdmin, deleteProduct);

module.exports = productRoutes;
