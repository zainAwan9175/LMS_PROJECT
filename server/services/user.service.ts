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


export const getAllUsersService=async(res:Response)=>{
    const users=await userModel.find().sort({createdAt:-1});
    res.status(201).json({
        success:true,
        users
    })
}

export const updateUserRoleService=async(res:Response,id:string,role:string)=>{
    const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });

   redis.set(id,JSON.stringify(user))
    res.status(201).json({
        success:true,
        user
    })
}