import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
}
 
});

export default mongoose.model("clientSchema", clientSchema);
