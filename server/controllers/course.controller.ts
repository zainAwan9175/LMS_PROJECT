import { NextFunction,Request,response,Response } from "express";
import { CatchAsyncErrore } from "../middleware/catchAsyncErrors";
import ErroreHandler from "../utils/ErroreHandler";
import cloudinary from "cloudinary"
import { createCourse ,getAllCoursesService} from "../services/course.service";
import CourseModel from "../Models/course.model";
import { redis } from "../utils/redis";
import { json } from "stream/consumers";
import axios from "axios";
import userModel from "../Models/user.model";
import mongoose from "mongoose";
import notificationModel from "../Models/niootificationModel";

import { title } from "process";
import ejs from "ejs"
import path from "path";
import sendMailer from "../utils/sendMail";

export const uploadCourse=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const data=req.body;

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


const urlToBase64 = async (imageUrl: string): Promise<string | null> => {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    return `data:image/jpeg;base64,${Buffer.from(response.data).toString("base64")}`;
  } catch (error) {
    console.error("Error converting URL to Base64:", error);
    return null;
  }
};






export const editCourse = CatchAsyncErrore(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    console.log(data)
    const courseId = req.params.id;

    // ✅ Find the course first
    const existingCourse = await CourseModel.findById(courseId);
    if (!existingCourse) {
      return next(new ErroreHandler("Course not found", 404));
    }

    // ✅ Handle Thumbnail Update
    if (data.thumbnail) {
      if (data.thumbnail.url && data.thumbnail.url.startsWith("data:")) {
        // 🔹 Delete old thumbnail if it exists
        if (existingCourse.thumbnail?.public_id) {
          await cloudinary.v2.uploader.destroy(existingCourse.thumbnail.public_id);
        }

        // 🔹 Upload new thumbnail
        const uploadedImage = await cloudinary.v2.uploader.upload(data.thumbnail.url, { folder: "courses" });

        // 🔹 Update thumbnail data
        data.thumbnail = {
          public_id: uploadedImage.public_id,
          url: uploadedImage.secure_url,
        };
      } else {
        console.log("Using existing thumbnail data:", data.thumbnail);
      }
    }

    // ✅ Update Course Data
    const updatedCourse = await CourseModel.findByIdAndUpdate(courseId, { $set: data }, { new: true });

    // ✅ Return Response
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error: any) {
    console.error("Error updating course:", error.message);
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
await redis.set(req.params.id,JSON.stringify(course),"EX",604800)

    }

    catch(error:any)
    {
      return next(new ErroreHandler(error.message, 500));
    }
  })



  //get  all course without purchasing


  export const getAllCourses=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
    try{
      // const isCashExist=await redis.get("allCourses");
      // if(isCashExist)
      // {
      //   const courses=JSON.parse(isCashExist );
      //   console.log("hitting redis")
      //   res.status(200).json({
      //     success:true,
      //     courses
      //   })
      //   }
      //   else{
      //     const courses=await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links")

      //     await redis.set("allCourses",JSON.stringify(courses))
      //     console.log("hitting mongodb")
      //     res.status(200).json({
      //       success:true,
      //       courses
      //     })
      //   }
      const courses=await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links")

      await redis.set("allCourses",JSON.stringify(courses))
      console.log("hitting mongodb")
      res.status(200).json({
        success:true,
        courses
      })
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

   await notificationModel.create({
    user:req.user?._id,
    title:'New Question Recieve',
    message:`You have a new Question from ${content?.title}`
})

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
          await notificationModel.create({
            user:req.user?._id,
            title:'New Question Reply Recieve',
            message:`You have a new Question reply in ${content?.title}`
        })
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
      
          await notificationModel.create({
            user:req.user?._id,
            title:'New Question Reply Recieve',
            message:`You have a new Question reply in ${content?.title}`
        })
  
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
  question:comment,
 }
console.log(replyData)
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


//get all courses --- for admin 
  // get all users --- only for admin

export const getAllCoursesForAdmin=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
  try{
    getAllCoursesService(res)

  }
  catch(err:any)
  {
      return next(new ErroreHandler(err.message, 400));
  }
})

// delete course only for admin

export const deleteCourse=CatchAsyncErrore(async(req:Request,res:Response,next:NextFunction)=>{
  try{
     const {id}=req.params ;
     const course=await CourseModel.findById(id)
     if(!course)
     {
      return next (new ErroreHandler("Course notr found",400))
     }

    await CourseModel.findByIdAndDelete(id);
    await redis.del(id);


      res.status(200).json({
      success: true,
      message:"course deleted successfully",
});
  }
  catch(err:any)
  {
    return next(new ErroreHandler(err.message,400))
  }
})


//genrate video url

export const generateVideoUrl = CatchAsyncErrore(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { videoId } = req.body;

    const response = await axios.post(
      `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      { ttl: 300 }, // Correct placement of body data
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
    
        },
      }
    );

    res.json(response.data);
  } catch (err: any) {
    return next(new ErroreHandler("hhhhh", 400));
  }
});