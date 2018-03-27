const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const productRoutes = require('./api/routes/products')
const vendorRoutes = require('./api/routes/vendor')
const adminRoutes = require('./api/routes/admin')

mongoose.Promise = Promise;

let attempt = 0
const connectDb = () => {
    mongoose
        .connect( 'mongodb://dmitry:' + process.env.MONGO_ATLAS_PW + process.env.MONGO_ATLAS_DB )
        .then(db => {
            if(db && attempt < 4) {
                start();
            } else {
                attempt++
                setTimeout(connectDb, 1000)
            }
        })
        .catch(err => console.error(err.message))
}

// mongoose.connection.on('error')

const start = () => {
    app.use(morgan('dev'))
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

    app.use(cors())

    //routes which should handle requests
    app.use('/admin', adminRoutes)
    app.use('/products', productRoutes)
    app.use('/vendors', vendorRoutes)



    app.use((req, res, next) => {
        const error = new Error('not found');
        error.status = 404;
        next(error);
    })

    app.use((error, req, res, next) => {
        res.status(error.status || 500);
        res.json({
            error: {
                message: error.message
            }
        })
    })
}

connectDb()

module.exports = app;