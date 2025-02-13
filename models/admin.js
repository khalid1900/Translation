import mongoose from "mongoose";

const adminModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: { type: String, default: "admin" } // 🔹 Role added

    
})

export default mongoose.model("Admin", adminModel)