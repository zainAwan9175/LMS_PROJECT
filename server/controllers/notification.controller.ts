import notificationModel from "../Models/niootificationModel";
import { Request,NextFunction,Response } from "express";

import { CatchAsyncErrore } from "../middleware/catchAsyncErrors";
import ErroreHandler from "../utils/ErroreHandler";
import cron from "node-cron"



export const getNotification =CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const notifications=await notificationModel.find().sort({createdAt:-1})
        res.status(201).json({
            success:true,
            notifications
        })

    }
    catch(err:any)
    {
  return next(new ErroreHandler(err.message,500))
    }
})


// update the status of the notification



export const updateNotificationStatus=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const notification=await notificationModel.findById(req.params.id)
        if(!notification)
        {
            return next(new ErroreHandler("Notification not found",400))
        }
        else{
            await notificationModel.findByIdAndUpdate(req.params.id, {status:"read"});
        }
        const notifications=await notificationModel.find().sort({createdAt:-1})
        res.status(201).json({
            success:true,
            notifications
        })

    }
    catch(err:any)
    {
        return next(new ErroreHandler(err.message,400))
    }
})



//delete the notifications 
cron.schedule("0 0 0 * * *",async()=>{
    const thirtyDaysAgo =new Date(Date.now()-30*24*60*60*1000);
    await notificationModel.deleteMany({status:"read",createdAt:{$lt:thirtyDaysAgo}});
    console.log("Deleted read notificstion")
})


