const ErrorHandler = require('../utils/Errorhandler');
const jwt = require('jsonwebtoken');

exports.isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(
            new ErrorHandler("user must be login to get the resources!", 500)
        )
    }

    const { id } = jwt.verify(token, process.env.JWTSECERETKEY);
    req.id = id;
    next();

};
