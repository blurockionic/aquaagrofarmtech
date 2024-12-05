import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  designation: {
    type: String,
  },
  joiningDate: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  salary: {
    type: Number,
  },
  activeEmployee: {
    type: Boolean,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
