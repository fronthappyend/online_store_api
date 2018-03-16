const mongoose = require('mongoose');
const config = require('../../config')

const vendorSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: config.vendor.email_regexp
    },
    password: { type: String, required: true},
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    address: { type: String },
    state: { type: String, required: true }
})

module.exports = mongoose.model('Vendor', vendorSchema)