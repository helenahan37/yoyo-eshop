const express = require('express');
const checkLogin = require('../middlewares/checkLogin');
const isAdmin = require('../middlewares/isAdmin');
const { createColor, getAllColors, getColor, updateColor, deleteColor } = require('../controllers/colorController');

const colorRoutes = express.Router();

colorRoutes
	.post('/', checkLogin, isAdmin, createColor)
	.get('/', getAllColors)
	.get('/:id', getColor)
	.put('/:id', checkLogin, isAdmin, updateColor)
	.delete('/:id', checkLogin, isAdmin, deleteColor);

module.exports = colorRoutes;
