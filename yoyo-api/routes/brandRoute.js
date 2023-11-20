const express = require('express');
const checkLogin = require('../middlewares/checkLogin');
const isAdmin = require('../middlewares/isAdmin');
const { createBrand, getAllBrands, getBrand, updateBrand, deleteBrand } = require('../controllers/brandController');

const brandRoutes = express.Router();

brandRoutes
	.post('/', checkLogin, isAdmin, createBrand)
	.get('/', getAllBrands)
	.get('/:id', getBrand)
	.put('/:id', checkLogin, isAdmin, updateBrand)
	.delete('/:id', checkLogin, isAdmin, deleteBrand);

module.exports = brandRoutes;
