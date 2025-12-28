import cors from "cors";
import express from "express";
import dotenv from 'dotenv';
import authRouter from "./routes/authRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import reimbursementRouter from './routes/reimbursementRoutes.js'
import cookieParser from "cookie-parser";

dotenv.config({
  path: "./.env"
})

import connectDB from "./utils/dbConnection.js";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRouter)
app.use('/application', applicationRouter)
app.use('/reimbursement', reimbursementRouter)

app.get("/", (req, res) => {
  res.send("API is running...");
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Listening at PORT ${PORT}...`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();