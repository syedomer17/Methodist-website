import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      maxlength: 25,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      maxlength: 30,
      minlength: 10,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      minlength: 10,
    },
    rollNumber:{
        type: Number
    },
    studentVerified: {
      email: {
        type: Boolean,
        default: false,
      },
    },
    studentVerifiedToken: {
      email: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const studentModel = mongoose.model("student",studentSchema,"student");

export default studentModel;