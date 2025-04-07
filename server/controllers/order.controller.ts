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
import { newOrder,getAllOrdersService } from "../services/order.service";
import path from "path";
import { truncateByDomain } from "recharts/types/util/ChartUtils";
import { redis } from "../utils/redis";
require("dotenv").config();
const stripe =require("stripe")(process.env.STRIPE_SECRET_KEY)

// create an order  

export const createOrder=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    try{
   const {courseId,payment_info}=req.body;

   if (payment_info) {
    if ("id" in payment_info) {
        const paymentIntentId = payment_info.id;
        

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status !== "succeeded") {

            return next(new ErroreHandler("Payment not authorized", 400));
        }
    }
}

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
await redis.set(req.user?._id as string,JSON.stringify(user))
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

// get all orders --- for admin
export const getAllOrders=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        getAllOrdersService(res)
  
    }
    catch(err:any)
    {
        return next(new ErroreHandler(err.message, 400));
    }
  })

  //send stripe publishble key

  export const sendStripePublishableKey=CatchAsyncErrore(async(req:Request,res:Response)=>{
    
    res.status(200).json({
        publishablekey:process.env.STRIPE_PUBLISHABLE_KEY
    })

  })

  //new payment 
  export const newPayment = CatchAsyncErrore(async (req: Request, res: Response, next: NextFunction) => {
    try {
  
  
      const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "USD",
        metadata: {
          company: "E-Learning",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });
  
      res.status(201).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (err: any) {
      return next(new ErroreHandler(err.message, 400));
    }
  });
  