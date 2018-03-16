const express = require('express');
const router = express.Router();
const VendorController = require('../controllers/vendor-controllers')

router.post('/registration', VendorController.register_vendor)

router.post('/login', VendorController.login_vendor)

router.delete('/:vendorId', VendorController.delete_vendor)

module.exports = router;