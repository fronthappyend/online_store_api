const jwt = require('jsonwebtoken')

exports.auth_check = (req, res, next) => {
    try {
        const token = req.headers.x_access_token
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.userData = decoded
        next()
    } catch (error) {
        error.status = 401
        next(error)
    }
}

exports.vendor_check = (req, res, next) => {
    try {
        const token = req.headers.x_access_token_client
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        console.log(decoded)
        if(decoded.type === "vendor") {
            next()
        } else {
            next(error)
        }
    } catch (error) {
        error.status = 403
        next(error)
    }
}

exports.customer_check = (req, res, next) => {
    try {
        const token = req.headers.x_access_token_client
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        console.log(decoded)
        if(decoded.type === "customer") {
            next()
        } else {
            throw new Error("access for customers only")
        }
    } catch (error) {
        error.status = 403
        next(error)
    }
}