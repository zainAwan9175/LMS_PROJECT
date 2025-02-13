import express from "express"
import { isAuthenticated,authorizeRole } from "../middleware/auth";
import { createOrder,getAllOrders } from "../controllers/order.controller";
const orderrouter = express.Router()

orderrouter.post("/create-order",isAuthenticated,createOrder)
orderrouter.get("/get-all-orders",isAuthenticated,authorizeRole("admin"),getAllOrders)
export default orderrouter