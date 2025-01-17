import { NextFunction,Request,Response } from "express";
import { CatchAsyncErrore } from "../middleware/catchAsyncErrors";
import ErroreHandler from "../utils/ErroreHandler";
import cloudinary from "cloudinary"
import { createCourse } from "../services/course.service";
import CourseModel from "../Models/course.model";
export const uploadCourse=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const data=req.body;
        console.log(data)
        const thumbnail=data.thumbnail;
        const mycloud=await cloudinary.v2.uploader.upload(thumbnail,{
            folder:"courses"
        })
        data.thumbnail={
            public_id:mycloud.public_id,
            url:mycloud.secure_url,

        }
        createCourse(data,res,next)

    }
    catch(error:any){
        return next (new ErroreHandler(error.message,500))

    }

})
export const editCourse = CatchAsyncErrore(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const courseId = req.params.id;
  
      // Handle thumbnail updates if a new one is provided
      if (data.thumbnail) {
        // Destroy the old thumbnail
        await cloudinary.v2.uploader.destroy(data.thumbnail.public_id);
  
        // Upload the new thumbnail
        const mycloud = await cloudinary.v2.uploader.upload(data.thumbnail.url, {
          folder: "courses",
        });
  
        // Update thumbnail data
        data.thumbnail = {
          public_id: mycloud.public_id,
          url: mycloud.secure_url,
        };
      }
  
      // Update the course with the new data
      const course = await CourseModel.findByIdAndUpdate(courseId, { $set: data }, { new: true });
  
      if (!course) {
        return next(new ErroreHandler("Course not found", 404));
      }
  
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErroreHandler(error.message, 500));
    }
  });



  //get single course  without puchasing

  export const getSingleCourse=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    try{

      const course=await CourseModel.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links")
      res.status(200).json({
        success:true,
        course
      })


    }
    catch(error:any)
    {
      return next(new ErroreHandler(error.message, 500));
    }
  })
  