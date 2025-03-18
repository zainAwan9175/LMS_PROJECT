import express from "express";
import {getAllUsers, activateUser, forgetpassword,checkResetPasswordOtp,resetPassword,registrationUser, loginUser, logoutUser,updateAccessToken ,getUserInfo,socialAuth,updateUserInfo,updatePassword,updateProfilePicture,updateUserRole,deleteUser} from "../controllers/user.controller"; // Ensure logoutUser is imported
import { isAuthenticated,authorizeRole } from "../middleware/auth";
const userrouter = express.Router();

// Define routes
userrouter.post('/registration',registrationUser);

userrouter.post('/socialAuth',updateAccessToken,socialAuth );
userrouter.post("/activate-user", activateUser);
userrouter.post("/login", loginUser);
userrouter.get("/logout",isAuthenticated, logoutUser);
userrouter.get("/refreshtoken",updateAccessToken)
userrouter.get("/me",updateAccessToken,isAuthenticated, getUserInfo);
userrouter.put('/update-user-info',updateAccessToken,isAuthenticated,updateUserInfo );
userrouter.put('/update-user-password',updateAccessToken,isAuthenticated,updatePassword );
userrouter.put('/update-user-profile-picture',updateAccessToken,isAuthenticated,updateProfilePicture );
userrouter.get("/get-all-users",updateAccessToken,isAuthenticated,authorizeRole("admin"),getAllUsers)
userrouter.put("/update-role",updateAccessToken,isAuthenticated,authorizeRole("admin"),updateUserRole)
userrouter.delete("/delete-user/:id",updateAccessToken,isAuthenticated,authorizeRole("admin"),deleteUser)
userrouter.post("/forgetpassword",updateAccessToken,forgetpassword)
userrouter.post("/checkResetPasswordOtp",updateAccessToken,checkResetPasswordOtp)
userrouter.post("/resetPassword",updateAccessToken,resetPassword)

export default userrouter;
