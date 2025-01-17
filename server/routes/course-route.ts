import express  from "express";
import { authorizeRole,isAuthenticated } from "../middleware/auth";
import { uploadCourse ,editCourse,getSingleCourse} from "../controllers/course.controller";
const courseRouter=express.Router();
courseRouter.post("/create-course",isAuthenticated,authorizeRole("admin"),uploadCourse)
courseRouter.put("/edit-course/:id",isAuthenticated,authorizeRole("admin"),editCourse)
courseRouter.get("/get-course/:id",getSingleCourse)
export default courseRouter

