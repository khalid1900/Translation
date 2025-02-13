import mongoose from "mongoose";

// const fileSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
//   fileUrl: { type: String, required: true },
//   fileType: { type: String, required: true },
//   extractedText: { type: String }, 
//   status: { type: String, enum: ["Uploaded", "In Progress", "Completed"], default: "Uploaded" },
// }, { timestamps: true });

// export default mongoose.model("File", fileSchema);


const fileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  name: { type: String, required: true },     
  email: { type: String, required: true }, 
  fileUrl: { type: String, required: true },
  extractedText: { type: String }, 
  status: { type: String, enum: ["Uploaded", "In Progress", "Completed"], default: "Uploaded" },
}, { timestamps: true });

export default mongoose.model("File", fileSchema);
