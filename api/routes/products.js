const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/auth-check')

const ProductController = require('../controllers/product-controllers')

router.get('/', ProductController.products_get_all)

router.post('/', checkAuth, ProductController.products_create_one)

router.get('/:productId', ProductController.products_get_one)

router.patch('/:productId', checkAuth, ProductController.products_edit_one)

router.delete('/:productId', checkAuth, ProductController.products_delete_one)

module.exports = router