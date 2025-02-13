import express  from "express";
import { authorizeRole,isAuthenticated } from "../middleware/auth";
import { uploadCourse ,editCourse,getSingleCourse,getAllCourses,getCourseByUser,addQuestion,addAnswers,addReview,addReplyToReview,getAllCoursesForAdmin} from "../controllers/course.controller";
const courseRouter=express.Router();
courseRouter.post("/create-course",isAuthenticated,authorizeRole("admin"),uploadCourse)
courseRouter.put("/edit-course/:id",isAuthenticated,authorizeRole("admin"),editCourse)
courseRouter.get("/get-course/:id",getSingleCourse)
courseRouter.get("/get-allCourses",getAllCourses)
courseRouter.get("/get-course-content/:id",isAuthenticated,getCourseByUser)
courseRouter.put("/add-question",isAuthenticated,addQuestion)
courseRouter.put("/add-answer",isAuthenticated,addAnswers)
courseRouter.put("/add-review/:id",isAuthenticated,addReview);
courseRouter.put("/add-review-reply",isAuthenticated,authorizeRole("admin"),addReplyToReview)
courseRouter.get("/get-all-course",isAuthenticated,authorizeRole("admin"),getAllCoursesForAdmin)

export default courseRouter

