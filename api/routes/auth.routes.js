import express from "express";
import { deleteProfile, getProfile, login, logout, registration, updateDetails, verifyEmail } from "../controllers/auth.controller.js";


const router = express.Router();

//login routes
router.post("/login", login)

//sign up route
router.post("/signup", registration)

//update details
router.put("/update", updateDetails)

// logout route 
router.get("/logout", logout)

router.get("/me/:id", getProfile)

// endpoint for verify email
router.post("/verify", verifyEmail)

//endponint for delete email 
router.delete("/delete/:id", deleteProfile)


export default router