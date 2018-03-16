const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Product = require('../models/products')


module.exports = (req, res, next) => {
try {
    const token = req.headers.authorization.split(" ")[1]  //separate token from "Bearer"
    const vendorId = jwt.decode(token).vendorId
    const id = req.params.productId
    console.log(id + '/n' + token + vendorID)
    Product.findById(id)
        .exec()
        .then(product => {
            if (product.vendor === vendorId) {
                next()
            } else {
                throw new Error()
            }
        })
        .catch(err => console.log(err.message))
} catch (error) {
    console.log()
    return res.status(401).json({
         message: 'Vendor Auth failed'
    })

} }

// try {
//     const token = req.headers.authorization.split(" ")[1]  //separate token from "Bearer"
//     const decoded = jwt.verify(token, process.env.JWT_KEY)
//     req.userData = decoded
//     next()
// } catch (error) {
//     return res.status(401).json({
//         message: 'Auth failed'
//     })
// }
