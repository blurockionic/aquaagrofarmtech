import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      trim: true, // Removes extra spaces
    },
    designation: {
      type: String,
      trim: true, // Removes extra spaces
      required: [true, "Designation is required"], // Makes this field mandatory
    },
    joiningDate: {
      type: String, // Use Date type for better date manipulation
    },
    dateOfBirth: {
      type: String, // Use Date type
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary must be a positive number"], // Validation for minimum value
    },
    activeEmployee: {
      type: Boolean,
      default: true, // Default to active
    },
    address: {
      type: String,
      trim: true,
      required: [true, "Address is required"], // Makes this field mandatory
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set creation time
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth", // Reference to another model
      required: [true, "User ID is required"], // Validation for relationships
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
