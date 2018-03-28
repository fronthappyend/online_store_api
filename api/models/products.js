const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    status: { type: String, default: "ACTIVE"},
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema)


