import express from "express"
import { isAuthenticated,authorizeRole } from "../middleware/auth";
import { getUserAnalytic ,getCourseAnalytic,getOrderAnalytic} from "../controllers/analytic.controller";

const analyticrouter = express.Router()

analyticrouter.get("/get-user-analytic",isAuthenticated,authorizeRole("admin"),getUserAnalytic)
analyticrouter.get("/get-course-analytic",isAuthenticated,authorizeRole("admin"),getCourseAnalytic)
analyticrouter.get("/get-order-analytic",isAuthenticated,authorizeRole("admin"),getOrderAnalytic)

export default analyticrouter