import express from "express";
import { getEmployeeByEmail, getEmployeeById, getEmployees, newEmployee } from "../controllers/employee.controller.js";

const router = express.Router();

//add new employee
router.post("/new", newEmployee);

//get all employees
router.get("/all", getEmployees);

//get employee by id route endpoint
router.get("/:id", getEmployeeById);

//get employee by email route endpoint
router.get("/email", getEmployeeByEmail);

export default router;
