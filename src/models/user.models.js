import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        username:{
            type: String, 
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true             // used for searching
        },
        email:{
            type: String, 
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname:{
            type: String, 
            required: true,
            trim: true,
            index: true             
        },
        avatar: {
            type : String,              // Cloudinary url
            required: true,
        },
        coverImage: {
            type : String,             // Cloudinary url
        },
        watchHistory: [
            {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
        password: {
            type: String,
            required: [true, "Password is required"],
            unique: true,
        },
        refreshToken :
         {
            type: String,
        },
     },
      {timestamps: true}
)

// direct encryption is not possible, hence we use hooks
// pre hook is used when the data is about to be saved

userSchema.pre("save", async function (next) {
    // if(this.isModified("password"))    // to check whether the password is modified or not, I only want this to run when the password is modified else not.
    // but I am taking the easy way out, I will check if password is not modified using (!) and return to avoid more code.

    if(!this.isModified("password")) return next()

    this.password = bcrypt.hash(this.password, 10)
    next();
})

// designing custome methods: 
userSchema.methods.isPasswordCorrect = async function (password) {
    // compare returns either true or false
    return await bcrypt.compare(password, this.password)  // function compare(data: string, encrypted: string):
}

userSchema.methods.generateAccessToken = function(){
   return jwt.sign(                      // sign method in jwt is used to generate the token
    {
        _id: this._id,                  // id needs to be stored because rest we can access by database query i.e rest are optional
        email: this.email,  
        username: this.username,
        fullname: this.fullname,
    } ,
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }   
)
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(                     
        {
            _id: this._id,                  // Here, only _id is necessary because we dont store much data in refresh token as it gets updated frequently
        } ,
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }   
    )
}


export const User = mongoose.model("User", userSchema)














// can be written like this or import Schema directly
// const userSchema = new mongoose.Schema({}, { timestamps: true });   