const mongoose = require('mongoose')
const config = require('../../config')
const Vendor = require('../models/vendor')
const Product = require('../models/products')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.register_vendor = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.json({
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
                    return res.json({
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
                    res.json({
                        message: "Auth failed"
                    })
                }

            })

        })
        .catch(next)
}

exports.observe_vendor = (req, res, next) => {
    const id = req.userData.vendorId
    Vendor.findById(id).exec().then(result => {
        res.json({
            _id: id,
            name: result.firstname + " " + result.lastname,
            state: result.state
        })
    })
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

exports.products_create_one = (req, res, next) => {
    const vendorId = req.userData.vendorId
    const product = new Product({
        title: req.body.title,
        price: req.body.price,
        vendor: vendorId
    })
    product
        .save()
        .then(result => {
            res.json({
                message: 'New product created',
                createdProduct: {
                    title: result.title,
                    price: result.price,
                    vendorId: result.vendor,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: config.url + '/products/' + result._id
                    }

                }
            })
        })
        .catch(next)
}

exports.products_delete_one = (req, res, next) => {
    const vendorId = req.userData.vendorId
    const id = req.params.productId

    Product.remove({_id: id, vendor: vendorId})
        .exec()
        .then(result => {
            res.json({
                message: "Product is deleted"
            })
        })
        .catch(next)
}

exports.products_edit_one = (req, res, next) => {
    const vendorId = req.userData.vendorId
    const id = req.params.productId
    const updateOps = req.body        // shorten, maybe

    Product.update({_id: id, vendor: vendorId}, { $set: updateOps})
        .exec()
        .then(result => {
            res.json({
                _id: id,
                title: result.title,
                price: result.price,
                description: result.description,
                vendor: vendorId
            })
        })
        .catch(next)
}

