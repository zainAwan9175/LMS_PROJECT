import { NextFunction,Request,Response } from "express";
import ErroreHandler from "../utils/ErroreHandler";
export const errorHandlerMiddleware =(err:any,req:Request,res:Response,next:NextFunction)=>{
    err.statusCode= err.statusCode||500;
    err.message=err.message|| 'Internal server errore'
    //for wrong mongodb id errore

    if(err.name==='CastErrore')
    {
        const message=`Resourse not found. Invalid :${err.path}`
        err=new ErroreHandler(message,400)
    }

    // Dublicate keys Erore

    if(err.code===11000){
        const message=`Dublicate ${Object.keys(err)}  entered`
        err=new ErroreHandler(message,400);
    }

    //wron jwt 
    if(err.name==='JsonWebTokenError'){
        const message=`Json web token is invalid try again`
        err=new ErroreHandler(message,400)
    }

   //JWT expired errore

   if(err.name==='TokenExpiredError')
   {
    const message=`json web token is expired ,try again`
    err=new ErroreHandler(message,400);
   }

   res.status(err.statusCode).json({
    success:false,
    message:err.message
})

}


