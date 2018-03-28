const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth-check')
const CustomerController = require('../controllers/customer-controllers')

router.post('/registration', checkAuth.customer_check, CustomerController.register_customer)

router.post('/products/:productId', checkAuth.customer_check, checkAuth.auth_check, CustomerController.add_to_cart)

router.get('/products', checkAuth.customer_check, checkAuth.auth_check, CustomerController.explore_cart)

router.get('/', checkAuth.customer_check, checkAuth.auth_check, CustomerController.view_customer)


module.exports = router