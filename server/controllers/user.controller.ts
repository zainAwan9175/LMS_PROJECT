import { Request,Response,NextFunction } from "express";
import userModel from "../Models/user.model";
import ErroreHandler from "../utils/ErroreHandler";
import { CatchAsyncErrore } from "../middleware/catchAsyncErrors";
interface IRegisterionBody{
    name:string,
    email:string,
    password:string,
    avatar?:string,

}

export const registrationUser=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {name,email,password}=req.body;
        const isEmailExist=await userModel.findOne({email});
        if(isEmailExist){
            return next(new ErroreHandler("Email already exist",400))

        }
        const user:IRegisterionBody={
            name,
            email,
            password,
        }
        //const activationToken=createActivationToken(user)

    }
    catch(error:any)
    {
        return next(new ErroreHandler(error.message,400))
    }
})