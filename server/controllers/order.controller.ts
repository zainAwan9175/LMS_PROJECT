import mongoose from "mongoose"
import  {NextFunction,Request,Response} from "express";
import ErroreHandler from "../utils/ErroreHandler";
import orderModel from "../Models/orderModel";
import CourseModel, { ICourse } from "../Models/course.model";
import notificationModel from "../Models/niootificationModel";
import ejs from "ejs"
import sendMailer from "../utils/sendMail";


import { CatchAsyncErrore } from "../middleware/catchAsyncErrors";
import userModel, { IUser } from "../Models/user.model";
import { newOrder } from "../services/order.service";
import path from "path";


// create an order  

export const createOrder=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    try{
   const {courseId,payment_info}=req.body;
   const user=await userModel.findById(req.user?._id) as IUser
   const courseExist =user?.courses.find((item:any)=>{
   return item._id.toString()===courseId
   })
if(courseExist)
{
    return next(new ErroreHandler("You already purchased this course.",400))
}

const course =await CourseModel.findById(courseId) as ICourse;
if(!course)
{
    return next(new ErroreHandler("Course not found",400))
}

const data:any={
    courseId,
    userId:user._id,
    payment_info,
}



const mailData={
    order:{
        _id:courseId.toString().slice(0.6),
        name:course.name,
        price:course.price,
        date:new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})

    }
}

const html=await ejs.renderFile(path.join(__dirname,'../mail/order-confirmation.ejs'),{order:mailData})
if(user){
    await sendMailer({
        email:user.email,
        subject:"order Confermation",
        templete:"order-confirmation.ejs",
      data:mailData,
    })
}

user.courses.push(courseId);
await user.save();
await notificationModel.create({
    user:user?._id,
    title:'New Order',
    message:`You have a new Order from ${course.name}`
})

await CourseModel.findByIdAndUpdate(courseId, { $inc: { purchased: 1 } });
                                        
newOrder(data,res,next);

    }
    catch(err:any)
    {
        return next(new ErroreHandler(err.message,500))
    }

})