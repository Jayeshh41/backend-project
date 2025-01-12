import {asyncHandler} from "../utils/asyncHandler.js";

// creating a method to register a user: 
const registerUser = asyncHandler (async (req, res) => {
    res.status(200).json({
        message: "User registered successfully"
    });
});
 
export {registerUser};
// now the method is created, but it will only run when we have an url, so we need create routes (in routes folder).