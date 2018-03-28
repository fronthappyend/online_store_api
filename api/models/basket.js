const mongoose = require('mongoose');


const basketSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    date: { type: Date },
    price: { type: Number }

})

module.exports = mongoose.model('Basket', basketSchema)