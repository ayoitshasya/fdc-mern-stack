import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";
import multer from "multer";
import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import authenticateToken from "../middlewares/authenticateToken.js";
import userModel from "../models/User.js";
import { saveTempFile, deleteFile, uploadFile } from "../utils/upload.js";

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.get('/check-auth', authenticateToken, async (req, res) => {
      const e_id = req.user.e_id;
      const user = await userModel.findOne({ e_id });
      return res.status(200).json({ loggedIn: true, user: { e_id: e_id, fname: user.fname, lname: user.lname, user_type: user.user_type || null }});
})


router.post("/register-admins", authenticateToken ,async (req, res) => {  // Created for adding HODs and Convenors later.. not to be used in frontend
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



router.post("/register", async (req, res) => {
  try {
    const { fname, lname, e_id, email, password, department, designation, date_of_appointment, present_appointment } = req.body;

    const somaiyaEmailRegex = /^[a-zA-Z0-9._%+-]+@somaiya\.edu$/;

    if (!somaiyaEmailRegex.test(email)) {
      return res.status(400).json({
        message: "Only somaiya.edu email addresses are allowed"
      });
    }
    
    let user_type = "employee";
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

    res.status(200).json({ message: "Login successful", user: { e_id, fname:user.fname, lname: user.lname, user_type: user.user_type } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }

});


router.get("/profile", authenticateToken, async (req, res) => {
  const e_id = req.user.e_id;

  const userData = await User.findOne({ e_id });
  if (!userData) return res.status(404).json({ message: "User Not Found." });
  const { fname, lname, email, department, designation, date_of_appointment, present_appointment, user_type, profilePicture } = userData;
  res.json({ fname, lname, email, department, designation, date_of_appointment, present_appointment, e_id: userData.e_id, user_type, profilePicture });

})

router.put("/profile/picture", authenticateToken, upload.single("profilePicture"), async (req, res) => {
  try {
    const e_id = req.user.e_id;
    if (!req.file) return res.status(400).json({ message: "No image file provided." });

    const timestamp = Date.now();
    const ext = req.file.originalname.split(".").pop();
    const tempPath = await saveTempFile(req.file.buffer, `${timestamp}_profile.${ext}`);
    const imageUrl = await uploadFile(tempPath, "fdc/profile_pictures", "image");
    await deleteFile(tempPath);

    const user = await User.findOneAndUpdate(
      { e_id },
      { profilePicture: imageUrl },
      { new: true }
    );

    res.status(200).json({ message: "Profile picture updated.", profilePicture: user.profilePicture });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

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
    return res.status(401).send("No account associated with this Google account. Kindly Signup First.");
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
  res.redirect("http://localhost:5173/");
});


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "If that email is registered, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    await transporter.sendMail({
      from: `"KJSCE FDC Portal" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Password Reset Request — KJSCE FDC Portal",
      html: `
        <!DOCTYPE html>
        <html><head><meta charset="UTF-8"/></head>
        <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:30px 0;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                <tr><td style="background-color:#B7202E;padding:24px 32px;">
                  <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">K J Somaiya College of Engineering</h1>
                  <p style="margin:4px 0 0;color:#f5c6cb;font-size:13px;">Faculty Development Cell (FDC) Portal</p>
                </td></tr>
                <tr><td style="padding:32px;">
                  <p style="font-size:16px;color:#333333;margin:0 0 8px;">Hi ${user.fname || "there"},</p>
                  <p style="font-size:14px;color:#555555;line-height:1.6;margin:0 0 24px;">
                    We received a request to reset the password for your KJSCE FDC Portal account. Click the button below to set a new password.
                  </p>
                  <div style="text-align:center;margin:0 0 24px;">
                    <a href="http://localhost:5173/reset-password/${resetToken}"
                       style="display:inline-block;background-color:#B7202E;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:24px;font-size:14px;font-weight:700;">
                      Reset Password
                    </a>
                  </div>
                  <p style="font-size:13px;color:#777777;margin:0 0 8px;">This link expires in <strong>1 hour</strong>.</p>
                  <p style="font-size:13px;color:#777777;margin:0;">If you didn’t request this, you can safely ignore this email.</p>
                  <p style="font-size:13px;color:#777777;margin:24px 0 0;">
                    Warm regards,<br/>
                    <strong style="color:#333333;">KJSCE Faculty Development Cell</strong>
                  </p>
                </td></tr>
                <tr><td style="background-color:#f8f8f8;padding:16px 32px;border-top:1px solid #e0e0e0;">
                  <p style="margin:0;font-size:12px;color:#888888;text-align:center;">
                    This is an automated notification from the KJSCE FDC Portal. Please do not reply to this email.
                  </p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body></html>
      `,
    });

    console.log(`Password reset email sent to ${email}`);
    res.status(200).json({ message: "Reset password email sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Error sending email. Please try again." });
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
