import { Request,Response,NextFunction } from "express"; 
import ErroreHandler from "../utils/ErroreHandler";
import { CatchAsyncErrore } from "../middleware/catchAsyncErrors";
import userModel from "../Models/user.model";
import { generateLast12MonthData } from "../utils/analytic.genrator";
import orderModel from "../Models/orderModel";

import CourseModel from "../Models/course.model";
// get user analytics for admin


export const getUserAnalytic =CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        
     const users=await generateLast12MonthData(userModel);
     res.status(200).json({
        success:true,
        users,

     })
    }
    catch(err:any)
    {
        return next(new ErroreHandler(err.message,400))
    }
})


export const getOrderAnalytic =CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        
     const orders=await generateLast12MonthData(orderModel);
     res.status(200).json({
        success:true,
        orders,

     })
    }
    catch(err:any)
    {
        return next(new ErroreHandler(err.message,400))
    }
})


export const getCourseAnalytic =CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        
     const courses=await generateLast12MonthData(CourseModel);
     res.status(200).json({
        success:true,
        courses,

     })
    }
    catch(err:any)
    {
        return next(new ErroreHandler(err.message,400))
    }
})