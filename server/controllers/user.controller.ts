import { Request,Response,NextFunction } from "express";
import userModel from "../Models/user.model";
import ErroreHandler from "../utils/ErroreHandler";
import { CatchAsyncErrore } from "../middleware/catchAsyncErrors";
import { IUser } from "../Models/user.model";
import jwt, {JwtPayload, Secret } from "jsonwebtoken"
import dotenv from "dotenv"
import ejs from "ejs"
import path from "path";
import sendMailer from "../utils/sendMail";
import { accessTokenOption, refreshTokenOption, sendToken } from "../utils/JWT";
import { redis } from "../utils/redis";
import { getUserById,getAllUsersService } from "../services/user.service";
import cloudinary from "cloudinary";
dotenv.config();
interface IRegisterionBody{
    
    name:string,
    email:string,
    password:string,
    avatar?:string,

}
export const registrationUser = CatchAsyncErrore(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {
            return next(new ErroreHandler("Email already exists", 400));
        }

        const user: IRegisterionBody = {
            name,
            email,
            password,
        };

        // Create activation token
        const { token, activecode } = createActivationToken(user);

        // Prepare data for email
        const data = { user: { name: user.name }, activationCode: activecode };

        const html = await ejs.renderFile(path.join(__dirname, "../mail/activation-mailer.ejs"), data);

        try {
            await sendMailer({
                email: user.email,
                subject: "Activate your account",
                templete: "activation-mailer.ejs",  // Ensure the template name is correct /activation-mailer.html
                data,
            });

            res.status(201).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account!`,
                activationToken: token,  // Send only the token
            });

        } catch (err: any) {
            return next(new ErroreHandler(err.message, 400));
        }

    } catch (error: any) {
        return next(new ErroreHandler(error.message, 400));
    }
});

interface Activecodetoken{
    token:string,
    activecode:string;
}


export const createActivationToken =(user:any):Activecodetoken=>{
    const activecode=Math.floor(Math.random()*9000+1000).toString()
    const token = jwt.sign(
        { user, activecode },
        process.env.JWTKEY as Secret,
        { expiresIn: '5m' } // Token will expire after 5 minutes
      );
      
    return {token,activecode}

}


interface Iactivationrequest{
    activation_token:string,
    activation_code:string,
}



export const activateUser=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        interface IRegisterionBody{
    
            name:string,
            email:string,
            password:string,
            avatar?:string,
        
        }

        const{activation_token,activation_code}=req.body;


        const newUser:{user:IUser;activecode:string}=jwt.verify(
            activation_token,
            process.env.JWTKEY as Secret
        ) as {user:IUser;activecode:string}
        if(newUser.activecode!=activation_code)
        {
            return next(new ErroreHandler("Invalid activation code ",400))
        }

        const {name,email,password}=newUser.user;

        const existUser=await userModel.findOne({ email });
        if(existUser)
        {
            return next(new ErroreHandler("Email already exist",400))
        }
        const user= await userModel.create({
            name,
            email,
            password,
        })


        res.status(201).json({
            success:true,
        })


    }
    catch(err:any){
        return next(new ErroreHandler(err.message,400))
    }
})





interface IloginUser{
    email:string,
    password:string,
}

export const loginUser=CatchAsyncErrore(
    async (req:Request,res:Response,next:NextFunction)=>{
        try{
              const {email,password}=req.body as IloginUser;
                if(!email||!password)
                {
                    return next(new ErroreHandler("Please enter email and password",400))
                }

                const user=await userModel.findOne({email}).select("+password") as IUser;
                if(!user)
                {
                    return next(new ErroreHandler("Please enter correct  email and password !",400))
                }
                const passwordMatch=await user.comparePassword(password);
                if(!passwordMatch)
                {
                    return next(new ErroreHandler("Please enter correct email and password",400))
                }

                sendToken(user,res,200)
        }
        catch(err:any)
        {
            return next(new ErroreHandler(err.message,400))
        }
    }
)


// Logout User
export const logoutUser = CatchAsyncErrore(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Clear cookies
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });

      // Retrieve and ensure the user ID is a string
      const userId = req.user?._id?.toString();
      if (!userId) {
        return next(new ErroreHandler("User ID is missing", 400));
      }

      // Remove the user data from Redis
      await redis.del(userId);

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (err: any) {
      return next(new ErroreHandler(err.message, 400));
    }
  }
);




//update access token
import { ObjectId } from "mongodb";

export const updateAccessToken=CatchAsyncErrore(
    async(req:Request,res:Response, next:NextFunction)=>{

        try{
            const refreshToken=req.cookies.refresh_token as string;
            const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN as string) as JwtPayload


            if(!decoded)
            {
                return next(new ErroreHandler("Could not refresh token",400))
            }
        
            const session=await redis.get(decoded.id)
            if(!session){
                return next(new ErroreHandler("Could not refresh token",400))

            }

            const user=JSON.parse(session)
            const accessToken=jwt.sign({id:user._id},process.env.ACCESS_TOKEN as string,{expiresIn:"5m"})
            const refreshtoken=jwt.sign({id:user._id},process.env.REFRESH_TOKEN as string,{expiresIn:"5d"})
            req.user=user;
            res.cookie('access_token', accessToken, accessTokenOption);
            res.cookie('refresh_token', refreshtoken, refreshTokenOption);
            res.status(200).json({
                status:"success",
                accessToken
            })
        }
        catch(err:any)
        {
            return next(new ErroreHandler(err.message,400))
        }
    
}
)




//get user info

export const getUserInfo=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId=req.user?._id as string;
      

        getUserById(userId  ,res)


    }
    catch(err:any){
        return next(new ErroreHandler(err.message,400))

    }
})



interface IsocialAuthBody{
    email:string,
    name:string,
    avatar:string,
}


// social auth  

export const socialAuth=CatchAsyncErrore(
    async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const {name,email,avatar}=req.body as IsocialAuthBody ;
            const user=await userModel.findOne({email})
            if(!user)
            {
                const  newUser=await userModel.create({email,name,avatar})
                sendToken(newUser,res,200)
            }
            else{
                sendToken(user,res,200)
            }

        }
        catch(err:any)
        {
            return next(new ErroreHandler(err.message,400))
        }
    }
)



//update user info


interface IUpdateUserInfo{
    name:string,
    email:string,

}

export const updateUserInfo=CatchAsyncErrore(
    async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const {name,email}=req.body as IRegisterionBody;
            const userId=req.user?._id as string;
           
            const  user=await userModel.findById(userId);
            if(user &&email)
            {
                const isEmailExist=await userModel.findOne({email});
                if(isEmailExist)
                {
                    return next(new ErroreHandler("Email is already exist",400))
                }
                user.email=email;
            }

            if(name&& user)
            {
                user.name=name;
            }
            await user?.save();
            redis.set(userId,JSON.stringify(user))
res.status(201).json({
    success:true,
    user
})


        }
        catch(err:any)
        {
            return next(new ErroreHandler(err.message,400))
        }
    }
)






// uipdate user password

interface IUpdatePassword{
    oldPassword:string,
    newPassword:string,
}

export const  updatePassword=CatchAsyncErrore(
    async (req:Request,res:Response,next:NextFunction)=>{

        try{
            const {oldPassword,newPassword}=req.body as IUpdatePassword;
            if(!oldPassword||!newPassword)
            {
                return next(new ErroreHandler("Please enter old and new password",400))
            }
            const userId=req.user?._id;
            const user=await userModel.findById(userId).select("+password")
            if(user?.password==undefined)
            {
                return next(new ErroreHandler("Invalid user",400))
            }
            const isPasswordValid=await user.comparePassword(oldPassword);
            if(!isPasswordValid)
            {
                return next(new ErroreHandler("Invalid old password",400))  
            }

            user.password=newPassword;
            await user.save();
            return res.status(201).json({
                success:true,
                user,
            })


        }
        catch(err:any)
        {
            return next(new ErroreHandler(err.message,400))

        }
    }
)

// update user profile picture

interface IUpdateProfilePicture {
    avatar: string;
}

export const updateProfilePicture = CatchAsyncErrore(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { avatar } = req.body as IUpdateProfilePicture;
            const userId = req.user?._id;

            const user = await userModel.findById(userId);

            if (!user) {
                return next(new ErroreHandler("User not found", 404));
            }

            if (avatar) {
                // Delete the old avatar if it exists
                if (user.avatar?.public_id) {
                    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
                }

                // Upload the new avatar
                const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "avatar",
                    width: 150,
                });

                // Update user's avatar
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.url,
                };

                // Save updated user information
                await user.save();
                await redis.set(userId as string,JSON.stringify(user))
            }

            // Respond to the client
            res.status(200).json({
                success: true,
                 user
            });
        } catch (err: any) {
            return next(new ErroreHandler(err.message, 400));
        }
    }
);



// get all users --- only for admin

export const getAllUsers=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        getAllUsersService(res)

    }
    catch(err:any)
    {
        return next(new ErroreHandler(err.message, 400));
    }
})