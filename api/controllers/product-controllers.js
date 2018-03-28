const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const Product = require('../models/products')
Schema = mongoose.Schema



exports.products_get_one = (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
        .select('title price _id vendor description status')
        .exec()
        .then(doc => {
            if(doc) {
                res.json({
                    product: doc
                })
            } else {
                res.json({
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
        .populate("vendor", "state firstname")
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

exports.products_delete_all = (req, res, next) => {
     Product.remove()
        .exec()
        .then(result => {
            res.json({
                message: "Products are deleted"
            })
        })
        .catch(next)
}

exports.products_of_state = (req, res, next) => {

    Product.find()

        .populate("vendor", "email firstname")
        .select('title price _id vendor')
        .exec()
        .then(docs => {

            const products = docs;
            let result = {};

            products.forEach(p => {
                if(!result[p.vendor.state]) {
                    result[p.vendor.state] = [p]
                } else {
                    result[p.vendor.state].push(p)
                }
            })

            res.json(
                result
            )

        })

    .catch(next)
}
