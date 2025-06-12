import cors from 'cors';
import express from "express";
import dotenv from 'dotenv';
dotenv.config({
  path: "./.env"
})

import cookieParser from "cookie-parser";
import connectDB from "./utils/dbConnection.js";
import { userModel } from './models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authenticateToken from './middlewares/authenticateToken.js';


const PORT = process.env.PORT;

const app = express();

app.use(cors({credentials: true}));
app.use(express.json());
app.use(cookieParser());



connectDB();


app.get("/", (req, res) => {
    res.send("API is running...");
});


app.post("/register", async (req, res) => {
    const { fname, lname, e_id, email, password, department, designation, date_of_appointment, present_appointment, user_type } = req.body;
    const existing = await userModel.findOne({ e_id });
    const existingmail = await userModel.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });
    if (existingmail) return res.status(400).json({ message: "Email already exists" });
  
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.create({ fname, lname, e_id, email, password: hashedPassword,department, designation, date_of_appointment, present_appointment, user_type });
    res.json({ message: "User registered successfully" });
  });



  app.post("/login", async (req, res) => {
    const { e_id, password } = req.body;
    const user = await userModel.findOne({ e_id });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  
    const token = jwt.sign({ e_id: user.e_id }, process.env.SECRET_KEY, { expiresIn: "1h" });



    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "none",
      maxAge: 3600000 
    });

    res.status(200).json({ message: "Login successful" });
  });
  

  app.get("/profile", authenticateToken ,async (req, res) => {
    const e_id = req.user.e_id;
    console.log(req.user)
    const userData = await userModel.findOne({e_id})
    const{fname, lname, email, department, designation } = userData;
    console.log(userData)
    if(!userData) return res.status(501).json({ message: "Server issue, try logging in again." });
    res.json({fname, lname, email, department, designation, e_id: userData.e_id });
  })

app.listen(PORT, ()=>{
    console.log(`Listening at PORT ${PORT}...`)
})
