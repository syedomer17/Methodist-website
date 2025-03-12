import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    staffName: {
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
    staffId: {
      type: Number,
    },
    staffVerified: {
      email: {
        type: Boolean,
        default: false,
      },
    },
    staffVerifiedToken: {
      email: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const staffModel = mongoose.model("staff",staffSchema,"staff");

export default staffModel;