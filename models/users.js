import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"], // ตรวจสอบว่าต้องมี username
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        role: {
            type: String,
            default: "user", // ค่าเริ่มต้นเป็น "user"
        },
    },
    {
        timestamps: true, // ใช้ timestamps เพื่อเก็บ createdAt และ updatedAt
    }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
