const express = require('express');
const checkLogin = require('../middlewares/checkLogin');
const categoryUpload = require('../config/categoryUpload');
const {
	createCategory,
	getAllCategories,
	getCategory,
	updateCategory,
	deleteCategory,
} = require('../controllers/categoryController');

const categoryRoutes = express.Router();

categoryRoutes
	.post('/', checkLogin, categoryUpload.single('file'), createCategory)
	.get('/', getAllCategories)
	.get('/:id', getCategory)
	.put('/:id', checkLogin, updateCategory)
	.delete('/:id', checkLogin, deleteCategory);

module.exports = categoryRoutes;
