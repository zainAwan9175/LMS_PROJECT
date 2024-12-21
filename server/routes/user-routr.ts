import express from "express"
import { Router } from "express"
const userrouter=express.Router();
import {registrationUser} from "../controllers/user.controller"
userrouter.post('/registration',registrationUser)

export default userrouter