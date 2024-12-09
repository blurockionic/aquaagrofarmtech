import express from "express";
import { getAdvanceOrLoanReport, getAttendance, getAttendanceById, getAttendanceReport, getAttendanceReportById, markAttendance, specificEmployeeAttendanceReport } from "../controllers/attendance.controller.js";

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

//endpoint for get attendance of specific employee
router.get("/employee/:id", getAttendanceById)

//specific employee report of attendance
router.get("/report/employee/:id", specificEmployeeAttendanceReport)

export default router