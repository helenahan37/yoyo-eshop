const express = require('express');
const checkLogin = require('../middlewares/checkLogin');
const { createReview } = require('../controllers/reviewController');

const reviewRoutes = express.Router();

reviewRoutes.post('/:productID', checkLogin, createReview);

module.exports = reviewRoutes;
