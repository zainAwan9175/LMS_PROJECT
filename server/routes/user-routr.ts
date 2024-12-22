import express from "express";
import { activateUser, registrationUser, loginUser, logoutUser } from "../controllers/user.controller"; // Ensure logoutUser is imported

const userrouter = express.Router();

// Define routes
userrouter.post('/registration', registrationUser);
userrouter.post("/activate-user", activateUser);
userrouter.post("/login", loginUser);
userrouter.get("/logout", logoutUser);

export default userrouter;
