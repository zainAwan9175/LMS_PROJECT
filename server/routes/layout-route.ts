import express from "express"
import { isAuthenticated,authorizeRole } from "../middleware/auth";
import { createLayout, editLayout, getLayoutById } from "../controllers/layout.controller";
const layoutrouter = express.Router()


layoutrouter.post("/create-layout",isAuthenticated,authorizeRole("admin"),createLayout);
layoutrouter.put("/edit-layout",isAuthenticated,authorizeRole("admin"),editLayout)
layoutrouter.get("/get-layout",getLayoutById)
export default layoutrouter
