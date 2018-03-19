const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const cors = require('cors')

const productRoutes = require('./api/routes/products');
const vendorRoutes = require('./api/routes/vendor')

mongoose.connect( 'mongodb://dmitry:' + process.env.MONGO_ATLAS_PW + process.env.MONGO_ATLAS_DB )

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(cors())

//routes which should handle requests
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

module.exports = app;