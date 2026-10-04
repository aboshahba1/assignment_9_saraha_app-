import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/saraha_app_assignment_9",{serverSelectionTimeoutMS:5000});
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection error:", error.message);
    }
};

export default connectDB;