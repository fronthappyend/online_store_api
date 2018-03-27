const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/auth-check')

const ProductController = require('../controllers/product-controllers')

router.get('/', checkAuth.customer_check, ProductController.products_get_all)

router.get('/state', checkAuth.customer_check, ProductController.products_of_state)

router.get('/:productId', checkAuth.customer_check, ProductController.products_get_one)

router.delete('/', ProductController.products_delete_all)

module.exports = router