const express = require('express')
const router = express.Router()

const AdminController = require('../controllers/admin-controllers')

router.get('/auth/clients/:clientType/auth-token', AdminController.admin_panel)


module.exports = router