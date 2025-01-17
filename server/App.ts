import express from "express"
export const app=express()

import cors from "cors";
import { NextFunction,Request,Response } from "express"
import {errorHandlerMiddleware} from "./middleware/errore"
import userrouter from "./routes/user-routr"
import courseRouter from "./routes/course-route";

import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
app.use(bodyParser.json());



//body parser
app.use(express.json({limit:"50mb"}));


app.use(cookieParser())

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
   
    credentials: true,
}));


app.get("/test",(req:Request,res:Response,next:NextFunction)=>{
    res.status(200).json({
        success:true,
        message:"api find successfully"
    })
})


app.use("/user",userrouter);
app.use("/course",courseRouter);


app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err: any = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404; // Add a custom property
    next(err); // Pass the error to the error-handling middleware
});

app.use(errorHandlerMiddleware)