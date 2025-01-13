import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.models.js";          // to check if user already exists
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


// access and refresh token is so common, hence we are creating a method for it
const generateAccessAndRefreshTokens  = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()        // saving refresh token in DB(we want refreshtoken to be in DB also)
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})      // validation is used because by default the password and other fields in mongoose DB get kickedin, to avoid it we need to set validateBeforeSave to false.
        
        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens")
    }
}

// creating a method to register a user: 
const registerUser = asyncHandler (async (req, res) => {
    // get the details from frontend (through postman we can take the data)
    // validation - not empty(to ensure all checks applied to udername, email are followed)
    // check if user already exists: username or email
    // check for images, check for avatar
    // upload them to cloudinary, avatar(again check for avatar as its required field)
    // create user object - create entry in DB (.create)
    // remove password and refresh token field from response(we dont want to send them to frontend)
    // checking user creation - to check whether response is recieved or not
    // return response

    // getting user details (req.body)
    const {username, fullname, email, password} = req.body      // req.body access is by default given by express

    
    // validation (checking every field at once rather than applying if-else in loop)
    if ([fullname, email, username, password].some((field) => 
        field?.trim() === "")){
    throw new ApiError(400, "All fields are required");
    }

    // check if user already exists
    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })
    if (existedUser){
        throw new ApiError(409, "User already exists")
    }

    // check for images, check for avatar
   const avatarLocalPath = req.files?.avatar[0]?.path                  // req.files access is by default given by multer
// const coverImageLocalPath = req.files?.cover[0]?.path 

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

   // we compulsarily need avatar (my requirement) hence, need to check if it exists
   if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
   }

   // upload to cloudinary
   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   // checking avatar again (because we need to check if it exists)
   if (!avatar) {
       throw new ApiError(400, "Avatar file is required");
   }

   // create user object - create entry in DB (.create)
   const user = await User.create({
    fullname, 
    avatar: avatar.url,
    coverImage: coverImage?.url || "",        // coverImage is not compulsory hence we haven't applied the check to coverImage like avatar,if coverImage is not uploaded, it will be empty string 
    email,
    password,
    username: username.toLowerCase(), 
   })

   // to cross-verify if user is actually created
   // mongoDB creates a '_id' field compulsarily with every entry
   const createdUserCheck = await User.findById(user._id).select("-password -refreshToken")             // we dont want to send password and refresh token to frontend so its written like this(weird syntax)

   if(!createdUserCheck){
    throw new ApiError(500, "Something went wrong while registering the user")
   }

   // return response
// return res.status(201).json({createdUserCheck}); this will also work

   return res.status(201).json(
    new ApiResponse(200, createdUserCheck, "User registered successfully")
   )
});

const loginUser = asyncHandler(async(req, res) => {
    // get data from -> req.body
    // login through username or email
    // find the user (to check if user exists)
    // password check (if password isn't checked, send password is wrong)
    // if password is checked, then generate access and refresh token
    // send this tokens as cookies and send response(successful login)

     // get data from -> req.body
    const {email, username, password} =  req.body
    if (!username && !email) {
        throw new ApiError (400, "Username or email is required")
     }

     // login through username or email
     const user = await User.findOne({
        $or: [{username}, {email}]
     })

    // find the user (to check if user exists)
     if(!user){
        throw new ApiError(404, "User doesn't exist")
     }

     // password check (if password isn't checked, send password is wrong)
     const isPasswordValid = await user.isPasswordCorrect(password)
     if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
     }

    // generate access and refresh token
     const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

     const loggedInUser = await User.findById(user._id).
     select("-password -refreshToken")    // fields that we dont want to send to frontend

    // send this tokens as cookies 
    const options = {
        httpOnly : true,    // only server can modify these cookies
        secure : true 
    }

    return res.
    status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, {
                user: loggedInUser, accessToken, refreshToken
            },
            // send response(successful login)
            "User logged in successfully"
        )
    )
});

const logoutUser = asyncHandler (async(req, res) => {
    // for logout functionality, we need to design a custom middleware to remove the cookies and refreshTokens
   await User.findByIdAndUpdate(
        // query
        req.user._id,           
        {
            // updating using mongoDB operator($set: set value of a field)
            $set: {
                refreshToken: undefined
            }
        },{
            new: true   // the response in return will be a new updated value
        }
    )
    const options = {
        httpOnly : true,    // only server can modify these cookies
        secure : true 
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out successfully")
    )

});

// creating a refresh access token as end-point for the user
const refreshAccessToken = asyncHandler(async(req, res) => {
    // we have 2 methods to access token, through cookies or if somene's using mobile app(through body)
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id) 
        if(!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is used or expired") 
        }
    
        // sending it as cookies:
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {newRefreshToken, accessToken}  = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, {accessToken, newRefreshToken},
                 "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
});

// adding functionality to change password
const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword) // will give value as either true or false

    if(!isPasswordCorrect){
        throw new ApiError(401, "Old password is incorrect")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res.
    status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
});

// get current user
const getCurrentUser = asyncHandler(async(req, res) => {
    return res.
    status(200)
    .json(200, req.user, "Current user fetched successfully")     // req.user = user is specified in the middleware(auth), hence its already injected
})

// updating account details
const updateAccountDetails = asyncHandler(async(req, res) => {
    const{username, fullname, email} = req.body
    if(!username || !fullname || !email){
        throw new ApiError(400, "All fields are required")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                username,
                fullname,
                email
            }
        },{new: true}   // the response in return will be a new updated information
    ).select("-password")   // dont want it to send password to frontend

    return res.
    status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

// updating user avatar
const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path           // from multer middleware

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400, "Error while uploading avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
    {
        $set:{
            avatar: avatar.url
        }
    }, 
    {new:true})
    .select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"))
});

// updating user cover image
const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path   // from multer middleware

    if(!coverImageLocalPath){
        throw new ApiError(400, "Cover image file is required")
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400, "Error while uploading cover image")
    }

   const user = await User.findByIdAndUpdate(
        req.user?._id,
    {
        $set:{
            coverImage: coverImage.url
        }
    }, 
    {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"))
});


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
};
// now the method is created, but it will only run when we have an url, so we need create routes (in routes folder).






























/* 
for validation, we could use multiple if-else loops but 
this is a better way to do it: 
if (
[fullname, username, email, password].some((field) =>
     field?.trim() === ""){
    throw new ApiError(400, "All fields are required")}
]
)

// earlier in the project, when we were only dealing with registerUser
export {registerUser};
// now the method is created, but it will only run when we have an url, so we need create routes (in routes folder).
*/ 