import { Express } from "express";
import userModel from "../Models/user.model";
import { Request,Response } from "express";
import { redis } from "../utils/redis";


export const getUserById=async(id:string,res:Response)=>{
    const userJson=await redis.get (id)
    if(userJson)
    {
        const user=JSON.parse(userJson)
        res.status(201).json({
            success:true,
            user
        })
    }
    0
}