import mongoose from "mongoose";

const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("MONGO BOY IS LIVE"));
    await mongoose.connect(`${process.env.MONGODB_URI}/green-stack`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDb;
