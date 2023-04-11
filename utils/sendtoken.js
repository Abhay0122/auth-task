exports.sendToken = function (user, res, statuscode) {
    const token = require('jsonwebtoken');

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIEEXPIRETIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    }

    res.status(statuscode).cookie('token', token, options).json({
        success: true,
        id: user._id,
        token
    })

}