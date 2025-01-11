// require("dotenv").config({path: './env'});

import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
});

// we have written the function connectDB() with asyncs await, and with async-await, promises are always used.

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log("Error: ",error)
})















// 2nd approach : where we used iife ()() with try catch and async await if the database lies in another continent. But this is not a good approach, we should create a seperate file (we will do in approach one)

/*
import express from 'express'
import mongoose from "mongoose";    
import { DB_NAME } from "./constants";

const app = express();
(async () => {
    try {
       await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
       app.on("error", (error) => {
        console.log("Error: ",error)
       })

       app.listen(process.env.PORT, () => {
           console.log(`App is listening on port ${process.env.PORT}`)
       })
    } catch (error) {
        console.log("Error: ",error)
        throw error
    }
}) ()
    */