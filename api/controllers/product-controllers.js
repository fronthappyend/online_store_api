const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const Product = require('../models/products')


exports.products_get_one = (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
        .select('title price _id vendor description')
        .exec()
        .then(doc => {
            if(doc) {
                res.json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all products',
                        url: config.url + '/products/'
                    }
                })
            } else {
                res.status(404).json({
                    message: "No valid entry found for id " + id
                })
            }
        })
        .catch(next)
}

exports.products_get_all = (req, res, next) => {

    const pageOptions = {
        page: req.query.page || 0,
        limit: parseInt(req.query.limit) || 10
    }

    const filter = {};
    if(req.query.vendor)
        filter.vendor = req.query.vendor;

    if(req.query.price)
        filter.price = req.query.price;

    if(req.query.price_gt) {
        filter.price = filter.price || {};
        filter.price.$gt = req.query.price_gt;
    }
    if(req.query.price_lt) {
        filter.price = filter.price || {};
        filter.price.$lt = req.query.price_lt;
    }

    Product.find(filter)
        .skip(pageOptions.limit * pageOptions.page)
        .limit(pageOptions.limit)
        .select('title price _id vendor')
        .exec()
        .then(docs => {
            res.json({
                count: docs.length,
                products: docs.map(doc => ({
                    title: doc.title,
                    price: doc.price,
                    vendor: doc.vendor,
                    url: {
                        type: 'GET',
                        url: config.url + '/products/' + doc._id
                    }
                }))
            });
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
            res.status(201).json({
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

exports.products_delete_one = (req, res, next) => {
    const vendorId = req.userData.vendorId
    const id = req.params.productId

    Product.remove({_id: id, vendor: vendorId})
        .exec()
        .then(result => {
            res.status(204)
        })
        .catch(next)
}

exports.products_state = () => {}
