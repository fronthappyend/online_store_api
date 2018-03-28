const mongoose = require('mongoose')
const config = require('../../config')
const Product = require('../models/products')
const Customer = require('../models/customer')
const Basket = require('../models/basket')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


exports.register_customer = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.json({
                error: err
            })
        } else {
            const customer = new Customer({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hash
            })
            jwt.sign({
                    id: customer._id,
                    firstname: customer.firstname,
                    lastname: customer.lastname,
                    email: customer.email
                },
                process.env.JWT_KEY,
                (err, token) => {
                    if (err) {
                        return res.error(err)
                    } else {
                        customer
                            .save()
                            .then(result => {
                                console.log(result)
                                res.json({
                                    message: "Customer is created",
                                    customer: customer,
                                    token: token
                                })
                            })
                            .catch(next)
                        }
                    })

        }
    })

}

exports.view_customer = (req, res, next) => {
        res.json({
            customer: req.userData
          })
}

exports.add_to_cart = (req, res, next) => {
    id = req.params.productId
    customer = req.userData
    Product.findById(id)
        .exec()
        .then(product => {
            const basket = new Basket({
                customer: customer.id,
                product: id,
                date: Date.now(),
                price: product.price
            })
            basket
                .save()
                .then(basket => {
                    res.json(basket)
                })
        })
        .catch(next)
}

exports.explore_cart = (req, res, next) => {
    id = req.userData.id
    Basket
        .find({customer: id})
        .exec()
        .then(result => res.json(result))
        .catch(next)
}