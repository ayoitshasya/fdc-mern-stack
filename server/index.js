import cors from "cors";
import express from "express";
import dotenv from 'dotenv';
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
dotenv.config({
  path: "./.env"
})

import connectDB from "./utils/dbConnection.js";



const PORT = process.env.PORT;

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter)



connectDB();


app.get("/", (req, res) => {
    res.send("API is running...");
});



app.listen(PORT, ()=>{
    console.log(`Listening at PORT ${PORT}...`)
})
