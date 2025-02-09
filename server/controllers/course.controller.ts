import { NextFunction,Request,Response } from "express";
import { CatchAsyncErrore } from "../middleware/catchAsyncErrors";
import ErroreHandler from "../utils/ErroreHandler";
import cloudinary from "cloudinary"
import { createCourse } from "../services/course.service";
import CourseModel from "../Models/course.model";
import { redis } from "../utils/redis";
import { json } from "stream/consumers";
import userModel from "../Models/user.model";
import mongoose from "mongoose";


import { title } from "process";
import ejs from "ejs"
import path from "path";
import sendMailer from "../utils/sendMail";

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
await redis.set(req.params.id,JSON.stringify(course))

    }

    catch(error:any)
    {
      return next(new ErroreHandler(error.message, 500));
    }
  })



  //get  all course without purchasing


  export const getAllCourses=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    try{
      const isCashExist=await redis.get("allCourses");
      if(isCashExist)
      {
        const courses=JSON.parse(isCashExist );
     
        res.status(200).json({
          success:true,
          courses
        })
        }
        else{
          const courses=await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links")

          await redis.set("allCourses",JSON.stringify(courses))
          console.log("hitting mongodb")
          res.status(200).json({
            success:true,
            courses
          })
        }

    }
    catch(error:any)
    {
      return next(new ErroreHandler(error.message, 500));
    }
  })

  // get course only for valid users

  export const getCourseByUser = CatchAsyncErrore(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const userCourseList = req.user?.courses;
 
  
      const isCourseExist = userCourseList?.find((course: any) => {
        return course._id.toString() === courseId; // Correct method: toString()
      });
  
      if (!isCourseExist) {
        return next(new ErroreHandler("You are not eligible to access this course", 404));
      }
  
      const course = await CourseModel.findById(courseId);
      const content = course?.courseData;
  
      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErroreHandler(error.message, 500));
    }
  });



  //add question in course

  interface IAddQuestionData{
    question:string;
    courseId:string;
    contentId:string;
  }
  

  export const addQuestion=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{

    try{

      const {question,courseId,contentId}=req.body as IAddQuestionData;
      const course=await CourseModel.findById(courseId);
      if(!mongoose.Types.ObjectId.isValid(contentId))
      {
        return next(new ErroreHandler("Invalid content Id", 400));
      }

      const content=course?.courseData.find((item:any)=>{
       return item._id.equals(contentId);
      })
    

      if(!content)
      {return next(new ErroreHandler("Invalid content Id", 400));
      }

      const newQuestion:any={
        user:req.user,
        question,
        questionReplies:[]
      }
   content.question.push(newQuestion);

   await course?.save();
   res.status(200).json({
    success: true,
    course,
  });

    }
    catch (error: any) {
      return next(new ErroreHandler(error.message, 500));
    }

  })


  // add  answers in the questions 

  interface IaddAnswer{
    answer:string;
    courseId:string;
    contentId:string;
    questionId:string;
    
  }
  export const addAnswers = CatchAsyncErrore(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { answer, courseId, contentId, questionId } = req.body as IaddAnswer;
  

  
        const course = await CourseModel.findById(courseId);
        if (!mongoose.Types.ObjectId.isValid(contentId)) {
          return next(new ErroreHandler("Invalid content Id", 400));
        }
  
        const content = course?.courseData.find((item: any) =>
          item._id.equals(contentId)
        );
  
        if (!content) {
          return next(new ErroreHandler("Invalid content Id", 400));
        }
  
        const question = content.question.find((item: any) =>
          item._id.equals(questionId)
        );
        if (!question) {
          return next(new ErroreHandler("Invalid QUESTION Id", 400));
        }
  
        const newAnswers: any = {
          user: req.user,
          answer,
        };
  
        question.questionReplies?.push(newAnswers);
        await course?.save();
  
        if (req.user?._id===question.user._id) {
          // Do nothing for self-reply
        } else {
          const data = {
            name: question.user?.name || "User",
            title: content?.title || "your question",
          };
  
  
          // Validate data
          if (!data.name || !data.title) {
            return next(new ErroreHandler("Data is missing required fields", 400));
          }
  
          const html = await ejs.renderFile(
            path.join(__dirname, "../mail/question-reply.ejs"),
            data 
          );
  
          try {
            await sendMailer({
              email: question.user.email,
              subject: "Question Reply",
              templete: "question-reply.ejs",
              data,
            });
          } catch (error: any) {
            return next(new ErroreHandler(error.message, 400));
          }
        }
  
        res.status(200).json({
          success: true,
          course,
        });
      } catch (error: any) {
        return next(new ErroreHandler(error.message, 500));
      }
    }
  );
  


  //add reviews;

  interface IaddReview{

    rating:Number,
    review:string,

    }


  export const addReview=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{

    try{
      const courseId = req.params.id;
      const userCourseList = req.user?.courses;
      console.log(req.body)

 
  
      const isCourseExist = userCourseList?.find((course: any) => {
        return course._id.toString() === courseId; // Correct method: toString()
      });
  
      if (!isCourseExist) {
        return next(new ErroreHandler("You are not eligible to access this course", 404));
      }
  

      const course =await CourseModel.findById(courseId) ;
      const {rating,review}=req.body as IaddReview;
      const newReview:any={
        user:req.user,
        rating,
        comment:review,

      }

      course?.reviews.push(newReview);
      let sum=0;
      course?.reviews.forEach((rev:any)=>{
        sum=sum+rev.rating;
      })

      if(course)
      {
        course.rating=sum/course.reviews.length;   //rating of the course is the avg rating ;
      }

await course?.save();


const notification={
  title: "New Review Received",
  message : `${req.user ?.name} has given a review in ${course?.name}`
}

//create the notification.
res.status(200).json({
  success:true,
  course,
})
      


    }
    catch(err:any)
    {
      return next(new ErroreHandler(err.message,500))
    }

  })



  //add reply in review
  


  interface IAddReplyToReview
{
  courseId:string,
  reviewId:string,
  comment:string,

}

export const addReplyToReview=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
  

  try{

    const {courseId,reviewId,comment} =req.body as IAddReplyToReview;

    const course= await CourseModel.findById(courseId) 
    if(!course)
    {
        return next(new ErroreHandler("Course not found",400))

    }

    const isReviewExist=course.reviews.find((rev:any)=>{
      return rev._id.toString()===reviewId;
    })


    if(!isReviewExist)
  {
    return next(new ErroreHandler("Review not found",400))
  }
 const replyData:any={
  user:req.user,
  questioin:comment,
 }

isReviewExist.commnetRepice?.push(replyData);
await course.save();

res.status(200).json({
  success: true,
  course,
});

}
  catch(error:any)
  {
    return next(new ErroreHandler(error.message,500))
  }
})