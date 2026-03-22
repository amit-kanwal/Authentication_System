import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async ()=>{
    try{
        await mongoose.connect(config.DATABASE_URL)
        console.log("Database connected")
    } catch(error){
        console.log(error)
    }  
}

export default connectDB;