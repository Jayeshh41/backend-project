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
                 
// routes import: 
import userRouter from "./routes/user.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

// routes declaration :
app.use("/api/v1/users", userRouter);            // writing ("api/v1") is a good practice. only ("/users") wont give an error and 'use' is a middleware
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)

// sample url: http://localhost:8000/api/v1/users/register
export {app};





/*
app.use(express.json({
    limit: "16kb"           // limit can be anything / can be changed accordingly
}))

app.use(express.urlencoded({}))         // it works even if we pass / specify nothing inside it
*/