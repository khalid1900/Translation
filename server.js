import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import { adminRoutes, clientRoutes, fileRoutes } from "./routes/routes.js";
import multer from "multer";
import errorHandler from "./middleware/errorHandler.js";
import cors from "cors"


const PORT = process.env.PORT || 5009;


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().any());


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      // useUnifiedTopology: true,

    });

    console.log(`MongoDB connected!`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.use(cors())
app.get("/", (_, res) => res.send(`API is running`));
app.use("/api/admin", adminRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/file", fileRoutes);
app.use((req, res) => res.send("Route not found"));

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  await connectDB();
});

