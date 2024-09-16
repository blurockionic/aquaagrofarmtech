import express from "express";
import { login, logout, registration, updateDetails } from "../controllers/auth.controller.js";


const router = express.Router();

//login routes
router.post("/login", login)

//sign up route
router.post("/signup", registration)

//update details
router.put("/update", updateDetails)

// logout route 
router.get("/logout", logout)

router.get("/me/:id", logout)


export default router