import multer from "multer";
import fs from "fs";

// method named storage
const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./public/temp")
        },
        filename: function (req, file, cb) {
            cb(null,file.originalname)
    }
})
    
// upload is a middleware
export const upload = multer({  
    storage,
 })


// this syntax is also correct
//  export const upload = multer({  
//     storage: storage
//  })