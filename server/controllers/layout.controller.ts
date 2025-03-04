import { Request,Response,NextFunction } from "express";
import ErroreHandler from "../utils/ErroreHandler";
import { CatchAsyncErrore } from "../middleware/catchAsyncErrors";
import cloudinary from "cloudinary"
import LayoutModel from "../Models/layout.model";

//create layout

export const createLayout=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {type}=req.body
        const isTypeExist=await LayoutModel.findOne({type});
        if(isTypeExist)
        {
            return next(new ErroreHandler(`${type} already exist`,400))
        }
        if(type==="Banner")
        {
            const{image,title,subTitle}=req.body
            const myCloud=await cloudinary.v2.uploader.upload(image,{
                folder:'layout'
            })
            const banner={
                image:{
                    public_id:myCloud.public_id,
                    url:myCloud.secure_url,
    
                },
                title,
                subTitle,
            }

            await LayoutModel.create(banner)
            
        }
        else if(type==="FAQ")
        {
            const {faq}=req.body
            const faqItems=await Promise.all(
                faq.map(async(item:any)=>{
                    return {
                        question:item.question,
                        answer:item.answer
                    }
                })
            )
            await LayoutModel.create({type:"FAQ",faq:faqItems})
        }
        else if(type==="Categories")
        {
            const {categories}=req.body
            const categoriesItems=await Promise.all(
                categories.map(async(item:any)=>{
                    return {
                          title:item.title
                    }
                })
            )
            await LayoutModel.create({type:"Categories",categories:categoriesItems})
        }
     res.status(200).json({
        success:true,
        message: "Layout create Successfully"
     })
    }
    catch(err:any)
    {
        return next(new ErroreHandler(err.message,400))
    }
})


export const editLayout= CatchAsyncErrore(async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {type}=req.body
      
        if(type==="Banner")
        {
            const{image,title,subTitle}=req.body
            const bannerData:any=await LayoutModel.findOne({type:"Banner"})
            if(bannerData)
            {
                await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
            }
            const myCloud=await cloudinary.v2.uploader.upload(image,{
                folder:'layout'
            })
            const banner={
                image:{
                    public_id:myCloud.public_id,
                    url:myCloud.secure_url,
    
                },
                title,
                subTitle,
            }

            await LayoutModel.findByIdAndUpdate(bannerData._id,{banner})
            
        }
        else if(type==="FAQ")
        {
            const {faq}=req.body
            const faqData=await LayoutModel.findOne({type:"FAQ"})
            const faqItems=await Promise.all(
                faq.map(async(item:any)=>{
                    return {
                        question:item.question,
                        answer:item.answer
                    }
                })
            )
            await LayoutModel.findByIdAndUpdate(faqData?._id,{type:"FAQ",faq:faqItems})
        }
        else if(type==="Categories")
        {
            const {categories}=req.body
            const CategoriesData:any=await LayoutModel.findOne({type:"Categories"})
            const categoriesItems=await Promise.all(
                categories.map(async(item:any)=>{
                    return {
                          title:item.title
                    }
                })
            )
            await LayoutModel.findByIdAndUpdate(CategoriesData._id,{type:"Categories",categories:categoriesItems})
        }
     res.status(200).json({
        success:true,
        message: "Layout edit Successfully"
     })
    }
    catch(err:any)
    {
        return next(new ErroreHandler(err.message,400))
    }
})


// get layouts by id 

export const getLayoutById=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {type}=req.body 
     const layout=await LayoutModel.findOne({type})
     res.status(200).json({
        success:true,
        layout
     })
    }
    catch(err:any)
    {
        return next(new ErroreHandler(err.message,400))
    }
})