import {Response} from "express";
import { CatchAsyncErrore } from "../middleware/catchAsyncErrors";
import orderModel from "../Models/orderModel";


//create new order

export const newOrder=CatchAsyncErrore(async(data:any,res:Response)=>{
    const order=await orderModel.create(data);

    res.status(201).json({
        success:true,
        order
    })
    
})