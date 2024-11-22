import { app } from "./App"
import dotenv from "dotenv";
import cors from "cors";
import mongodbconnection from "./utils/db";

dotenv.config();





app.listen(process.env.PORT,()=>{
    console.log(`server is running on the port ${process.env.PORT}`)
    mongodbconnection();

})