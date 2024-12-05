import mongoose from "mongoose";

const advanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "paid",
    },
    advanceAmount: {
      type: Number,
    },
    extraBonus: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Advance = mongoose.model("Advance", advanceSchema);

export default Advance;
