
import nodemailer from "nodemailer";
import userModel from "../models/User.js";
import {applicationModel} from "../models/Application.js";
import { reimbursementModel } from "../models/Reimbursement.js";

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
      else if (status.includes("fdc")) roleDisplay = "FDC";
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
  



  export async function notifyNextReviewer(userType, type, department, application) {
    let mailType;
  
    if (type === "application") {
      mailType = "Application";
    } else if (type === "reimbursement") {
      mailType = "Reimbursement Form";
    } else {
      return;
    }
  
    try {
  
      /* =======================
         CASE 1: HOD → FDC
      ======================= */
      if (userType === "hod") {
        const reviewers = await userModel.find({ user_type: "fdc" });
  
        if (!reviewers.length) {
          console.log("No FDC reviewers found.");
          return;
        }
  
        for (const reviewer of reviewers) {
          await transporter.sendMail({
            from: `"FDC Portal" <${process.env.MAIL_USER}>`,
            to: reviewer.email,
            subject: `New FDC ${mailType} Awaiting Your Review`,
            html: `
              <p>Hello ${reviewer.fname || "Reviewer"},</p>
              <p>A new ${mailType} has been approved by HOD and is awaiting your review.</p>
              <p>Please log in to the FDC portal to proceed.</p>
              <p>Regards,<br/>KJSSE FDC Admin</p>
            `,
          });
        }
  
        return;
      }
  
      /* =======================
         CASE 2: FDC → HOD (same department)
      ======================= */
      if (userType === "fdc") {
        const hod = await userModel.findOne({
          user_type: "hod",
          department: department
        });
  
        if (!hod) {
          console.log(`No HOD found for department ${department}`);
          return;
        }
  
        const applicantName = `${application.submitted_by.fname} ${application.submitted_by.lname}`;
  
        await transporter.sendMail({
          from: `"FDC Portal" <${process.env.MAIL_USER}>`,
          to: hod.email,
          subject: `${mailType} Approved by FDC`,
          html: `
            <p>Hello ${hod.fname || "HOD"},</p>
            <p>The ${mailType} submitted by <strong>${applicantName}</strong> has been approved by the FDC.</p>
            <p><strong>Form ID:</strong> ${application._id}</p>
            <p>Please log in to the portal for details.</p>
            <p>Regards,<br/>KJSSE FDC Admin</p>
          `,
        });
  
        return;
      }
  
    } catch (err) {
      console.error("Error sending reviewer notification:", err);
    }
  }
  
  

  export async function notifyHODReimbursement(e_id, department) {
    try {
      const hods = await userModel.find({ user_type: "hod", department });
      if (!hods.length) {
        console.log(`No HODs found for department ${department}`);
        return;
      }
      for (const hod of hods) {
        await transporter.sendMail({
          from: `"FDC Portal" <${process.env.MAIL_USER}>`,
          to: hod.email,
          subject: `New FDC Reimbursement Request Requires Your Review`,
          html: `
            <p>Hello ${hod.fname || "HOD"},</p>
            <p>A reimbursement request submitted by employee ID <b>${e_id}</b> from your department is awaiting your review.</p>
            <p>Please log in to the FDC portal to take necessary action.</p>
            <p>Regards,<br/>KJSSE FDC Admin</p>
          `,
        });
        console.log(`Reimbursement notification sent to HOD: ${hod.email}`);
      }
    } catch (error) {
      console.error("Error sending reimbursement notification to HOD:", error);
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


  export async function sendStatusMailReimbursement(reimbursementId, status, userId) {
    try {
      const user = await userModel.findById(userId);
      const form = await reimbursementModel.findById(reimbursementId).populate("application_id");
      
  
      if (!user || !form) {
        console.log("User or form not found for mailing.");
        return;
      }
  
      // Determine role display
      let roleDisplay = "";
      if (status.includes("hod")) roleDisplay = "HOD";
      else if (status.includes("fdc")) roleDisplay = "FDC";
      else roleDisplay = "Reviewer";
  
      const statusText = status.startsWith("approved")
        ? `approved by ${roleDisplay}`
        : `rejected by ${roleDisplay}`;
  
      const mailOptions = {
        from: `"FDC Portal" <${process.env.MAIL_USER}>`,
        to: user.email,
        subject: `Reimbursement Form ${statusText}`,
        html: `
          <p>Hello ${user.name || user.fname || "User"},</p>
          <p>Your Reimbursement Form for <b>${form.application_id.purpose}</b> organised by ${form.application_id.org_institution} has been <b>${statusText}</b>.</p>
          <p><b>Reimbursement ID:</b> ${form._id}</p>
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