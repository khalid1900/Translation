import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "client", // 🔹 Role added
  },

});

export default mongoose.model("Client", clientSchema); // ✅ Corrected model name
