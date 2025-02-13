import express from "express"
import { isAuthenticated,authorizeRole } from "../middleware/auth"
import { getNotification ,updateNotificationStatus} from "../controllers/notification.controller"
const notificationRoute=express.Router()



notificationRoute.get("/get-all-notification",isAuthenticated,authorizeRole("admin"),getNotification)
notificationRoute.put("/update-status/:id",isAuthenticated,authorizeRole("admin"),updateNotificationStatus)

export default notificationRoute