const mongoose = require('mongoose')
const config = require('../../config')
const Vendor = require('../models/vendor')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.register_vendor = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                })
            } else {
                const vendor = new Vendor({
                    email: req.body.email,
                    password: hash,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    address: req.body.address,
                    state: req.body.state

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
    })

}

exports.login_vendor = (req, res, next) => {

    Vendor.findOne({ email: req.body.email })
        .exec()
        .then(vendor => {
            bcrypt.compare(req.body.password, vendor.password, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    })
                }
                if(result) {
                    jwt.sign({
                            email: vendor.email,
                            vendorId: vendor._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        },
                        (err, token) => {
                            if (err) {
                                return res.error(err)
                            } else {
                                return res.json({
                                    message: 'Login successful',
                                    vendor_id: vendor._id,
                                    token: token
                                })
                            }
                        })

                } else {
                    res.status(401).json({
                        message: "Auth failed"
                    })
                }

            })

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

