exports.CreateError = (err, req, res, next) => {
    let statuscode = err.statuscode || 500;

    if(err.message === "token is expired!"){
        res.status(statuscode).json({message: 'user must be login'})
    }

    res.status(statuscode).json({
        message: err.message,
        name: err.name,
        stack: err.stack
    })

}