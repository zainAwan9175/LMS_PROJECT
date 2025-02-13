import express from "express";
import {getAllUsers, activateUser, registrationUser, loginUser, logoutUser,updateAccessToken ,getUserInfo,socialAuth,updateUserInfo,updatePassword,updateProfilePicture,updateUserRole,deleteUser} from "../controllers/user.controller"; // Ensure logoutUser is imported
import { isAuthenticated,authorizeRole } from "../middleware/auth";
const userrouter = express.Router();

// Define routes
userrouter.post('/registration',registrationUser);

userrouter.post('/socialAuth',socialAuth );
userrouter.post("/activate-user", activateUser);
userrouter.post("/login", loginUser);
userrouter.get("/logout",isAuthenticated,authorizeRole('admin'), logoutUser);
userrouter.get("/refreshtoken",updateAccessToken)
userrouter.get("/me",isAuthenticated, getUserInfo);
userrouter.put('/update-user-info',isAuthenticated,updateUserInfo );
userrouter.put('/update-user-password',isAuthenticated,updatePassword );
userrouter.put('/update-user-profile-picture',isAuthenticated,updateProfilePicture );
userrouter.get("/get-all-users",isAuthenticated,authorizeRole("admin"),getAllUsers)
userrouter.put("/update-role",isAuthenticated,authorizeRole("admin"),updateUserRole)
userrouter.delete("/delete-user/:id",isAuthenticated,authorizeRole("admin"),deleteUser)
export default userrouter;
