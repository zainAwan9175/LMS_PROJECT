import express  from "express";
import { authorizeRole,isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
import { uploadCourse ,editCourse,getSingleCourse,getAllCourses,getCourseByUser,addQuestion,addAnswers,addReview,addReplyToReview,getAllCoursesForAdmin,deleteCourse,generateVideoUrl} from "../controllers/course.controller";
const courseRouter=express.Router();
courseRouter.post("/create-course",updateAccessToken,isAuthenticated,authorizeRole("admin"),uploadCourse)
courseRouter.put("/edit-course/:id",updateAccessToken,isAuthenticated,authorizeRole("admin"),editCourse)
courseRouter.get("/get-course/:id",updateAccessToken,getSingleCourse)
courseRouter.get("/get-allCourses",getAllCourses)
courseRouter.get("/get-course-content/:id",updateAccessToken,isAuthenticated,getCourseByUser)
courseRouter.put("/add-question",updateAccessToken,isAuthenticated,addQuestion)
courseRouter.put("/add-answer",updateAccessToken,isAuthenticated,addAnswers)
courseRouter.put("/add-review/:id",updateAccessToken,isAuthenticated,addReview);
courseRouter.put("/add-review-reply",updateAccessToken,isAuthenticated,authorizeRole("admin"),addReplyToReview)
courseRouter.get("/get-all-course",updateAccessToken,isAuthenticated,authorizeRole("admin"),getAllCoursesForAdmin)
courseRouter.delete("/delete-course/:id",updateAccessToken,isAuthenticated,authorizeRole("admin"),deleteCourse)
courseRouter.post("/getVdoCipherOTP",generateVideoUrl)
export default courseRouter

