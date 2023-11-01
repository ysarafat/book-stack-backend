import cors from "cors";
import dotenv from "dotenv";
import express, { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import userRoutes from "./router/user";
const PORT = process.env.PORT || 8000;
const app = express();
dotenv.config();
// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err.message);
  });
//
// routes
app.use("/api/users", userRoutes);
// start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// default error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
};

app.use(errorHandler);
