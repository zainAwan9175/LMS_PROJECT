import { Request,Response,NextFunction } from "express";
import userModel from "../Models/user.model";
import ErroreHandler from "../utils/ErroreHandler";
import { CatchAsyncErrore } from "../middleware/catchAsyncErrors";
import { IUser } from "../Models/user.model";
import jwt, { Secret } from "jsonwebtoken"
import dotenv from "dotenv"
import ejs from "ejs"
import path from "path";
dotenv.config();
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
        const activationToken=createActivationToken(user)
        const activecode=activationToken.activecode;
        const data={user:{name:user.name},code:activecode};
        const html=await ejs.renderFile(path.join(__dirname,"../mail/activation-mailer.html"),data)
        try{

        }
        catch(err:any)
        {

        }

    }
    catch(error:any)
    {
        return next(new ErroreHandler(error.message,400))
    }
})
interface Activecodetoken{
    token:string,
    activecode:string;
}


export const createActivationToken =(user:any):Activecodetoken=>{
    const activecode=Math.floor(Math.random()*9000+1000).toString()
    const token=jwt.sign({user,activecode},process.env.JWTKEY as Secret)
    return {token,activecode}

}