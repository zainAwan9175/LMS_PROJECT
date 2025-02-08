import express  from "express";
import { authorizeRole,isAuthenticated } from "../middleware/auth";
import { uploadCourse ,editCourse,getSingleCourse,getAllCourses,getCourseByUser,addQuestion,addAnswers,addReview} from "../controllers/course.controller";
const courseRouter=express.Router();
courseRouter.post("/create-course",isAuthenticated,authorizeRole("admin"),uploadCourse)
courseRouter.put("/edit-course/:id",isAuthenticated,authorizeRole("admin"),editCourse)
courseRouter.get("/get-course/:id",getSingleCourse)
courseRouter.get("/get-allCourses",getAllCourses)
courseRouter.get("/get-course-content/:id",isAuthenticated,getCourseByUser)
courseRouter.put("/add-question",isAuthenticated,addQuestion)
courseRouter.put("/add-answer",isAuthenticated,addAnswers)
courseRouter.put("/add-review/:id",isAuthenticated,addReview)

export default courseRouter

