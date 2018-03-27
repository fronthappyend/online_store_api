const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth-check')
const VendorController = require('../controllers/vendor-controllers')

router.get('/', checkAuth.vendor_check, checkAuth.auth_check, VendorController.observe_vendor)

router.post('/registration', checkAuth.vendor_check, VendorController.register_vendor)

router.post('/login', checkAuth.vendor_check, VendorController.login_vendor)

router.post('/products', checkAuth.vendor_check, checkAuth.auth_check, VendorController.products_create_one)

router.delete('/products/:productId', checkAuth.vendor_check, checkAuth.auth_check, VendorController.products_delete_one)

router.patch('/products/:productId', checkAuth.auth_check, VendorController.products_edit_one)

router.delete('/:vendorId', VendorController.delete_vendor)

module.exports = router;