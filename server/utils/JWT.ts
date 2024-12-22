import dotenv from "dotenv";
dotenv.config();
import Redis from "ioredis";
import { Response } from "express";
import { IUser } from "../Models/user.model";
import { json } from "stream/consumers";
import {redis} from "./redis"
interface ITokenOption{
    expires:Date,
    maxAge:number,
    httpOnly:boolean,
    sameSite:'lax'|'strict' |'none'|undefined,
    secure?:boolean;

}
export const sendToken=async(user:IUser,res:Response,stauscode:number)=>{
    
        const accesstoken=user.signaccesstoken();
        const refreshtoken=user.signrefreshtoken();

        //upload session to redis
     //  redis.set(user._id,JSON.stringify(user) as any)
        //parse envoirnement variables


        const accesstoken_expire=parseInt(process.env.ACCESS_TOKEN_EXPIRE||'300',10);
        const refreshtoken_expire=parseInt(process.env.REFRESH_TOKEN_EXPIRE||'1200',10);
        //option for cookies
        const accessTokenOption:ITokenOption={
            expires:new Date(Date.now()+accesstoken_expire*1000),
            maxAge:accesstoken_expire*1000,
            httpOnly:true,
            sameSite:'lax',



        }

        const refreshTokenOption:ITokenOption={
            expires:new Date(Date.now()+refreshtoken_expire*1000),
            maxAge:refreshtoken_expire*1000,
            httpOnly:true,
            sameSite:'lax',
        }
        
        //only set secure  to true in production mode
        if(process.env.NODE_ENV==='prduction')
        {
            accessTokenOption.secure=true;
        }
        res.cookie('access_token',accesstoken,accessTokenOption);
        res.cookie("refresh_token",refreshtoken,refreshTokenOption)
        res.status(stauscode).json({
            success:true,
            user,
            accesstoken,
        })

}