import mongoose from "mongoose";
import config from "config";

const dbConnect = async () => {
  try {
    await mongoose.connect(config.get("DB_URL"));
    console.log("DB connected Successfully");
  } catch (error) {
    console.log(error);
  }
};
dbConnect();
