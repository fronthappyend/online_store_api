const mongoose = require('mongoose')
const config = require('../../config')
const Vendor = require('../models/vendor')
const jwt = require('jsonwebtoken')

exports.register_vendor = (req, res, next) => {
    const vendor = new Vendor({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: req.body.password
    })
    vendor
        .save()
        .then(result => {
            console.log(result)
            res.json({
                message: "Vendor is created",
                vendor: {
                    email: result.email,
                    id: result._id
                }
            })
        })
        .catch(next)

}

exports.login_vendor = (req, res, next) => {
    Vendor.findOne({ email: req.body.email })
        .exec()
        .then(vendor => {
            if(!vendor) {
                return res.status(401).json({
                    message: "Auth failed"
                })
            }
            if(vendor.password === req.body.password) {
                const token = jwt.sign({
                        email: vendor.email,
                        vendorId: vendor._id
                    }, process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    })
                res.json({
                    message: 'Login successful',
                    vendor_id: vendor._id,
                    token: token
                })

            } else {
                throw new Error('Auth failed!!!')
            }

        })
        .catch(next)
}

exports.delete_vendor = (req, res, next) => {
    Vendor.remove({_id: req.params.vendorId})
        .exec()
        .then(result => {
            res.json({
                message: "vendor deleted"
            })
        })
        .catch(next)
}

