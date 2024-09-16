import express from "express";
import { getAdvanceOrLoanReport, getAttendance, getAttendanceReport, getAttendanceReportById, markAttendance } from "../controllers/attendance.controller.js";

const router = express.Router();

//mark attendance
router.post("/mark", markAttendance)

//get attendance
router.get("/all", getAttendance)


//get aattendance report
router.get("/report", getAttendanceReport)

//get attendance by id
router.get("/report/:id", getAttendanceReportById)

//advance or loan
router.get("/advance/:id", getAdvanceOrLoanReport)

export default router