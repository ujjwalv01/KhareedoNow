const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { createOrders, getOrders, getOrderById, updateOrderStatus, getMyOrders } = require('../controllers/orderController');
const router = express.Router();

router.route('/').post(protect, createOrders).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;