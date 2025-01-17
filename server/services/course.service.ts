import { Request,Response,NextFunction } from "express";
import CourseModel from "../Models/course.model";
import { CatchAsyncErrore } from "../middleware/catchAsyncErrors";
import ErroreHandler from "../utils/ErroreHandler";

export const createCourse= CatchAsyncErrore(async(data:any,res:Response,)=>{

    const course=await CourseModel.create(data);
    res.status(201).json({
        success:true,
        course
    })
    
})