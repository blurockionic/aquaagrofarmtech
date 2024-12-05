import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  advanceOrLoan: {
    type: Number,
  },
  extraBonus: {
    type: Number,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
