import express from "express"
export const app=express()
import cors from "cors";
import { NextFunction,Request,Response } from "express";

import cookieParser from "cookie-parser";



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



app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err: any = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404; // Add a custom property
    next(err); // Pass the error to the error-handling middleware
});
