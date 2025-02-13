import mongoose from "mongoose";

const dummySchema = new mongoose.Schema({
    


  resume: {
    type: String,
    // required: true,
  },

 
});

export default mongoose.model("dummy", dummySchema);
