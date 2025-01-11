import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";    

const app = express();
app.use(cors())     // according to documentation
// origin and credentials are most commonly used in productions in a corporate
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true 
}));


app.use(express.json({limit: "16kb"}))      // used when data is accessed through form  

app.use(express.urlencoded({
    extended: true, limit: "16kb"
}))                // used when data is accessed through url

app.use(express.static("public"))                 //static is used to store the images, favicon or pdf on our server i.e. here public: refers to public folder

// cookieParser is used to access and set the cookies of the browser from server side
app.use(cookieParser()) 
                    
export default app





/*
app.use(express.json({
    limit: "16kb"           // limit can be anything / can be changed accordingly
}))

app.use(express.urlencoded({}))         // it works even if we pass / specify nothing inside it
*/