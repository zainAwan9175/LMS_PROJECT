import express from "express"
import { isAuthenticated,authorizeRole } from "../middleware/auth";
import { createOrder } from "../controllers/order.controller";
const orderrouter = express.Router()

orderrouter.post("/create-order",isAuthenticated,createOrder)
export default orderrouter