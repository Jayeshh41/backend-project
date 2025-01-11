// this is a wrapper function using promises that will be used everywhere in productions in industry

const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).resolve((error) => next(error))
    }
}
export default asyncHandler
    
    
    
    
// this is a wrapper function using try catch that will be used everywhere in productions in industry
    //     const asyncHandler = (func) => async (res, req, next) => {
    //         try {
    //             await func(req, res, next)
    //         } catch (error) {
    //             res.status(error.code || 500).json({success: false, message: error.message})
    //         }
    //     }
// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}        // using a higher order function
