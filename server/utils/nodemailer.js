
import nodemailer from "nodemailer";
import userModel from "../models/User.js";
import {applicationModel} from "../models/Application.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});


export async function sendStatusMail(applicationId, status, userId) {
    try {
      const user = await userModel.findById(userId);
      const application = await applicationModel.findById(applicationId);
  
      if (!user || !application) {
        console.log("User or application not found for mailing.");
        return;
      }
  
      // Determine role display
      let roleDisplay = "";
      if (status.includes("hod")) roleDisplay = "HOD";
      else if (status.includes("principal")) roleDisplay = "Principal";
      else if (status.includes("convenor")) roleDisplay = "FDC Convenor";
      else roleDisplay = "Reviewer";
  
      const statusText = status.startsWith("approved")
        ? `approved by ${roleDisplay}`
        : `rejected by ${roleDisplay}`;
  
      const mailOptions = {
        from: `"FDC Portal" <${process.env.MAIL_USER}>`,
        to: user.email,
        subject: `Application ${statusText}`,
        html: `
          <p>Hello ${user.name || user.fname || "User"},</p>
          <p>Your application for <b>${application.purpose}</b> organised by ${application.org_institution} has been <b>${statusText}</b>.</p>
          <p><b>Application ID:</b> ${application._id}</p>
          <p><b>Status:</b> ${status}</p>
          <p>Regards,<br/>KJSSE FDC Admin</p>
        `,
      };
  
      await transporter.sendMail(mailOptions);
      console.log(`Mail sent to ${user.email}`);
    } catch (err) {
      console.error("Error sending mail:", err);
    }
  }
  



export async function notifyNextReviewer(userType) {
    let nextRole;
  
    if (userType === "hod") {
      nextRole = "fdc-convenor";
    } else if (userType === "fdc-convenor") {
      nextRole = "principal";
    } else {
      return;
    }
  
    try {
      const reviewers = await userModel.find({ user_type: nextRole });
  
      if (!reviewers.length) {
        console.log(`No reviewers with role ${nextRole} found.`);
        return;
      }
  
      for (const reviewer of reviewers) {
        const mailOptions = {
          from: `"FDC Portal" <${process.env.MAIL_USER}>`,
          to: reviewer.email,
          subject: `New FDC Application Awaiting Your Review`,
          html: `
            <p>Hello ${reviewer.fname || "Reviewer"},</p>
            <p>A new application has been approved at a previous level and is now awaiting your review.</p>
            <p>Please log in to the FDC portal to proceed.</p>
            <p>Regards,<br/>KJSSE FDC Admin</p>
          `,
        };
  
        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to ${reviewer.email}`);
      }
  
    } catch (err) {
      console.error("Error sending reviewer notification:", err);
    }
  }
  

  export async function notifyHOD(e_id, department) {
    try {
      const hods = await userModel.find({
        user_type: "hod",
        department: department,
      });
  
      if (!hods.length) {
        console.log(`No HODs found for department ${department}`);
        return;
      }
  
      for (const hod of hods) {
        const mailOptions = {
          from: `"FDC Portal" <${process.env.MAIL_USER}>`,
          to: hod.email,
          subject: `New FDC Application Requires Your Review`,
          html: `
            <p>Hello ${hod.fname || "HOD"},</p>
            <p>An application submitted by employee ID <b>${e_id}</b> from your department is awaiting your review.</p>
            <p>Please log in to the FDC portal to take necessary action.</p>
            <p>Regards,<br/>KJSSE FDC Admin</p>
          `,
        };
  
        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to HOD: ${hod.email}`);
      }
    } catch (error) {
      console.error("Error sending notification to HOD:", error);
    }
  }