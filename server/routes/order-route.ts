import express from "express"
import { isAuthenticated,authorizeRole } from "../middleware/auth";
import { createOrder,getAllOrders,newPayment,sendStripePublishableKey } from "../controllers/order.controller";
const orderrouter = express.Router()

orderrouter.post("/create-order",isAuthenticated,createOrder)
orderrouter.get("/get-all-orders",isAuthenticated,authorizeRole("admin"),getAllOrders)
orderrouter.get("/payment/stipepublishablekey",sendStripePublishableKey)
orderrouter.post("/payment",isAuthenticated,newPayment)
export default orderrouter