import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";
import User from "../models/User.js"; // Note: ensure .js extension for ESM
import jwt from 'jsonwebtoken'
import authenticateToken from "../middlewares/authenticateToken.js";

dotenv.config();

const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    const { fname, lname, e_id, email, password, department, designation, date_of_appointment, present_appointment, user_type } = req.body;
    const existing = await User.findOne({ e_id });
    const existingmail = await User.findOne({ email });

    if (existing) return res.status(400).json({ message: "User already exists" });
    if (existingmail) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ fname, lname, e_id, email, password: hashedPassword, department, designation, date_of_appointment, present_appointment, user_type });
    res.json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }

});



router.post("/login", async (req, res) => {
  try {
    const { e_id, password } = req.body;
    const user = await User.findOne({ e_id });
    if (!user) return res.status(401).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ e_id: user.e_id, user_type: user.user_type }, process.env.SECRET_KEY, { expiresIn: "1h" });

    // Set the token in a cookie
    // Note: In production, set secure to true if using HTTPS
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000
    });

    res.status(200).json({ message: "Login successful", user: { e_id, user_type: user.user_type } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }

});


router.get("/profile", authenticateToken, async (req, res) => {
  const e_id = req.user.e_id;

  const userData = await User.findOne({ e_id });
  if (!userData) return res.status(404).json({ message: "User Not Found." });
  const { fname, lname, email, department, designation, user_type, profilePicture } = userData;
  res.json({ fname, lname, email, department, designation, e_id: userData.e_id, user_type, profilePicture });

})

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true if you're using HTTPS
  });
  res.status(200).json({ message: "Logged out successfully" });
});


// Set up Google OAuth2 credentials
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:4000/auth/google/callback"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Function to refresh OAuth2 token
async function getAccessToken() {
  try {
    const { token } = await oauth2Client.getAccessToken();
    return token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}

router.get("/google-login", (req, res) => {
  const redirectUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["profile", "email"],
  });
  res.redirect(redirectUrl);
});

router.get("/google/callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const ticket = await oauth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const email = payload.email;
    const picture = payload.picture;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).send("No account associated with this Google account.");
  }

  // Save profile picture to DB if not already saved or changed
  if (!user.profilePicture || user.profilePicture !== picture) {
    user.profilePicture = picture;
    await user.save();
  }

  // Set a token cookie
  const token = jwt.sign({ e_id: user.e_id, user_type: user.user_type }, process.env.SECRET_KEY, { expiresIn: "1h" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 3600000
  });

  // Redirect to frontend home page
  res.redirect("http://localhost:5173/home");
});


// Nodemailer transporter using Google OAuth2
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USERNAME,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    // Use a function that returns a promise resolving to access token
    accessToken: async () => await getAccessToken(),
  },
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const mailOptions = {
      from: `"MERN Auth App" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: "Password Reset Verification",
      html: `
        <p>Hi there,</p><br>
        <p>We received a request to reset your password. Click the link below:</p>
        <p><a href="http://localhost:3000/ResetPw/${resetToken}">Reset Password</a></p><br>
        <p>This link expires in 1 hour.</p>
        <p>If you didn’t request this, ignore this email.</p><br>
        <p>Best,</p>
        <p>MERN Auth App Team</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending email" });
      }
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "Reset password email sent" });
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
