import { Request,Response,NextFunction } from "express";
import jwt,{JwtPayload} from "jsonwebtoken";
import dotenv from "dotenv"

import userModel from "../Models/user.model";
dotenv.config()
import { CatchAsyncErrore } from "./catchAsyncErrors";
import ErroreHandler from "../utils/ErroreHandler";
export const isAuthenticated=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    const access_token=req.cookies.access_token as string;
     if(!access_token)
    { 
        return next(new ErroreHandler("Please login to access this resourse",400));

    }

    const decoded=jwt.verify(access_token,process.env.ACCESS_TOKEN as string) as JwtPayload
    if(!decoded)
    {
        return next(new ErroreHandler("access token os not valid",400));
    }

    const user= await userModel.findById({_id:decoded.id});
    if(!user)
    {
        return next(new ErroreHandler("user not find",400));
    }
    req.user=JSON.parse(user);
    next();
})