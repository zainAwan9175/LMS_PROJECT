import { app } from "./App"
import dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary"
import cors from "cors";
import mongodbconnection from "./utils/db";
import {initSocketServe} from "./socketServer"
import http from "http"
const server=http.createServer(app)
dotenv.config();
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_SECREAT_KEY
})



initSocketServe(server);

server.listen(process.env.PORT,()=>{
    console.log(`server is running on the port ${process.env.PORT}`)
    mongodbconnection();

})