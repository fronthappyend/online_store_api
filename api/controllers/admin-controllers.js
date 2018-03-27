const config = require('../../config')
const jwt = require('jsonwebtoken')


exports.admin_panel = (req, res, next) => {
    console.log(config.admin.password)
    console.log(req.params.clientType)

    // const password = config.admin.password
    const clientType = req.params.clientType

    if (req.headers.x_admin === "111") {
        jwt.sign({
            type: clientType
            },
            process.env.JWT_KEY,
            (err, token) => {
                if (err) {
                    return res.error(err)
                } else {
                    return res.json({
                        message: "go on, you're on the right way",
                        type: clientType,
                        token: token
                    })
                }
            })

    } else {
        res.status(401).json({
            message: "enter valid password"
        })
    }
}

