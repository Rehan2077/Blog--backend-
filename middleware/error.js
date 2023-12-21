export const errorMiddleware = (err, req, res, next) => {
    console.log("Inside");
    return res.status(400).json({
        success: false,
        message: err.message || "Server Internal Error!",
    })
}

export const invalidPathHandler = (req, res, next)=>{
    let error = new Error("Invalid Path!")
    next(error);
}