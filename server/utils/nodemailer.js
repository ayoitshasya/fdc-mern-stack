
import nodemailer from "nodemailer";
import userModel from "../models/User.js";
import {applicationModel} from "../models/Application.js";
import { reimbursementModel } from "../models/Reimbursement.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function emailLayout(title, bodyContent) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${title}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:30px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr>
                <td style="background-color:#B7202E;padding:24px 32px;">
                  <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.5px;">
                    K J Somaiya College of Engineering
                  </h1>
                  <p style="margin:4px 0 0;color:#f5c6cb;font-size:13px;">Faculty Development Cell (FDC) Portal</p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:32px;">
                  ${bodyContent}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color:#f8f8f8;padding:16px 32px;border-top:1px solid #e0e0e0;">
                  <p style="margin:0;font-size:12px;color:#888888;text-align:center;">
                    This is an automated notification from the KJSCE FDC Portal. Please do not reply to this email.<br/>
                    &copy; ${new Date().getFullYear()} Somaiya Vidyavihar University &mdash; K J Somaiya College of Engineering
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function statusBadge(isApproved) {
  const color = isApproved ? "#28a745" : "#dc3545";
  const label = isApproved ? "APPROVED" : "REJECTED";
  return `<span style="display:inline-block;background-color:${color};color:#ffffff;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;letter-spacing:1px;">${label}</span>`;
}

function infoRow(label, value) {
  return `
    <tr>
      <td style="padding:8px 12px;font-size:13px;color:#555555;font-weight:600;background-color:#f8f8f8;width:40%;border-bottom:1px solid #eeeeee;">${label}</td>
      <td style="padding:8px 12px;font-size:13px;color:#333333;border-bottom:1px solid #eeeeee;">${value}</td>
    </tr>
  `;
}


export async function sendStatusMail(applicationId, status, userId) {
  try {
    const user = await userModel.findById(userId);
    const application = await applicationModel.findById(applicationId);

    if (!user || !application) {
      console.log("User or application not found for mailing.");
      return;
    }

    let roleDisplay = "";
    if (status.includes("hod")) roleDisplay = "HOD";
    else if (status.includes("principal")) roleDisplay = "Principal";
    else if (status.includes("fdc")) roleDisplay = "FDC";
    else roleDisplay = "Reviewer";

    const isApproved = status.startsWith("approved");
    const statusText = isApproved ? `Approved by ${roleDisplay}` : `Rejected by ${roleDisplay}`;

    const remarksRows = [
      application.HOD_reason ? infoRow("HOD Remarks", application.HOD_reason) : "",
      application.final_recommendation ? infoRow("FDC Remarks", application.final_recommendation) : "",
    ].join("");

    const bodyContent = `
      <p style="font-size:16px;color:#333333;margin:0 0 8px;">Dear ${user.fname || "Faculty Member"},</p>
      <p style="font-size:14px;color:#555555;line-height:1.6;margin:0 0 24px;">
        Your FDC application has been reviewed. Please find the details below.
      </p>

      <p style="margin:0 0 16px;">Status: ${statusBadge(isApproved)}</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;border-radius:6px;overflow:hidden;margin-bottom:24px;">
        ${infoRow("Applicant Name", `${user.fname} ${user.lname}`)}
        ${infoRow("Employee ID", user.e_id)}
        ${infoRow("Department", user.department)}
        ${infoRow("Application ID", application._id)}
        ${infoRow("Program / Event", application.purpose)}
        ${infoRow("Organizing Institution", application.org_institution)}
        ${infoRow("Review Stage", statusText)}
        ${remarksRows}
      </table>

      ${isApproved && status === "approved-by-fdc" ? `
      <div style="background-color:#e8f5e9;border-left:4px solid #28a745;padding:12px 16px;border-radius:4px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#2e7d32;">
          <strong>Next Step:</strong> Your application has been approved by the FDC. You may now submit a Reimbursement Form through the FDC portal if applicable.
        </p>
      </div>` : ""}

      ${!isApproved ? `
      <div style="background-color:#fdecea;border-left:4px solid #dc3545;padding:12px 16px;border-radius:4px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#b71c1c;">
          If you have concerns regarding this decision, please contact the FDC office directly.
        </p>
      </div>` : ""}

      <p style="font-size:13px;color:#777777;margin:0;">
        Warm regards,<br/>
        <strong style="color:#333333;">KJSCE Faculty Development Cell</strong><br/>
        K J Somaiya College of Engineering, Somaiya Vidyavihar University
      </p>
    `;

    await transporter.sendMail({
      from: `"KJSCE FDC Portal" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: `[FDC Application] ${statusText} — ${application.purpose}`,
      html: emailLayout(`FDC Application ${statusText}`, bodyContent),
    });
    console.log(`Status mail sent to ${user.email}`);
  } catch (err) {
    console.error("Error sending mail:", err);
  }
}


export async function notifyNextReviewer(userType, type, department, application) {
  const mailType = type === "application" ? "Application" : type === "reimbursement" ? "Reimbursement Form" : null;
  if (!mailType) return;

  try {
    if (userType === "hod") {
      const reviewers = await userModel.find({ user_type: "fdc" });
      if (!reviewers.length) {
        console.log("No FDC reviewers found.");
        return;
      }

      for (const reviewer of reviewers) {
        const applicantName = application?.submitted_by
          ? `${application.submitted_by.fname} ${application.submitted_by.lname}`
          : "a faculty member";

        const bodyContent = `
          <p style="font-size:16px;color:#333333;margin:0 0 8px;">Dear ${reviewer.fname || "FDC Member"},</p>
          <p style="font-size:14px;color:#555555;line-height:1.6;margin:0 0 24px;">
            A new FDC ${mailType} has been reviewed and approved by the Head of Department. It is now pending your review and approval.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;border-radius:6px;overflow:hidden;margin-bottom:24px;">
            ${infoRow("Submitted By", applicantName)}
            ${application?.purpose ? infoRow("Program / Event", application.purpose) : ""}
            ${application?.org_institution ? infoRow("Organizing Institution", application.org_institution) : ""}
            ${application?._id ? infoRow("Form ID", application._id) : ""}
            ${infoRow("HOD Status", "Approved")}
          </table>

          <div style="background-color:#fff8e1;border-left:4px solid #f9a825;padding:12px 16px;border-radius:4px;margin-bottom:24px;">
            <p style="margin:0;font-size:13px;color:#e65100;">
              <strong>Action Required:</strong> Please log in to the FDC portal to review and process this ${mailType}.
            </p>
          </div>

          <p style="font-size:13px;color:#777777;margin:0;">
            Warm regards,<br/>
            <strong style="color:#333333;">KJSCE FDC Portal</strong><br/>
            K J Somaiya College of Engineering, Somaiya Vidyavihar University
          </p>
        `;

        await transporter.sendMail({
          from: `"KJSCE FDC Portal" <${process.env.MAIL_USER}>`,
          to: reviewer.email,
          subject: `[Action Required] New FDC ${mailType} Awaiting Your Review`,
          html: emailLayout(`New FDC ${mailType} Awaiting Review`, bodyContent),
        });
      }
      return;
    }

    if (userType === "fdc") {
      const hod = await userModel.findOne({ user_type: "hod", department });
      if (!hod) {
        console.log(`No HOD found for department ${department}`);
        return;
      }

      const applicantName = application?.submitted_by
        ? `${application.submitted_by.fname} ${application.submitted_by.lname}`
        : "a faculty member";

      const bodyContent = `
        <p style="font-size:16px;color:#333333;margin:0 0 8px;">Dear ${hod.fname || "HOD"},</p>
        <p style="font-size:14px;color:#555555;line-height:1.6;margin:0 0 24px;">
          We are pleased to inform you that the FDC ${mailType} submitted by <strong>${applicantName}</strong> has been reviewed and <strong>approved by the FDC Committee</strong>.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;border-radius:6px;overflow:hidden;margin-bottom:24px;">
          ${infoRow("Submitted By", applicantName)}
          ${application?.purpose ? infoRow("Program / Event", application.purpose) : ""}
          ${application?.org_institution ? infoRow("Organizing Institution", application.org_institution) : ""}
          ${application?._id ? infoRow("Form ID", application._id) : ""}
          ${infoRow("FDC Decision", "Approved")}
        </table>

        <p style="font-size:13px;color:#777777;margin:0;">
          Warm regards,<br/>
          <strong style="color:#333333;">KJSCE FDC Committee</strong><br/>
          K J Somaiya College of Engineering, Somaiya Vidyavihar University
        </p>
      `;

      await transporter.sendMail({
        from: `"KJSCE FDC Portal" <${process.env.MAIL_USER}>`,
        to: hod.email,
        subject: `[FDC Update] ${mailType} Approved by FDC — ${applicantName}`,
        html: emailLayout(`FDC ${mailType} Approved`, bodyContent),
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
      const bodyContent = `
        <p style="font-size:16px;color:#333333;margin:0 0 8px;">Dear ${hod.fname || "HOD"},</p>
        <p style="font-size:14px;color:#555555;line-height:1.6;margin:0 0 24px;">
          A new FDC Reimbursement Request has been submitted by a faculty member from your department and is awaiting your review and approval.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;border-radius:6px;overflow:hidden;margin-bottom:24px;">
          ${infoRow("Employee ID", e_id)}
          ${infoRow("Department", department)}
          ${infoRow("Current Status", "Pending HOD Review")}
        </table>

        <div style="background-color:#fff8e1;border-left:4px solid #f9a825;padding:12px 16px;border-radius:4px;margin-bottom:24px;">
          <p style="margin:0;font-size:13px;color:#e65100;">
            <strong>Action Required:</strong> Please log in to the FDC portal to review and approve or reject this reimbursement request.
          </p>
        </div>

        <p style="font-size:13px;color:#777777;margin:0;">
          Warm regards,<br/>
          <strong style="color:#333333;">KJSCE FDC Portal</strong><br/>
          K J Somaiya College of Engineering, Somaiya Vidyavihar University
        </p>
      `;

      await transporter.sendMail({
        from: `"KJSCE FDC Portal" <${process.env.MAIL_USER}>`,
        to: hod.email,
        subject: `[Action Required] New Reimbursement Request from Your Department`,
        html: emailLayout("New Reimbursement Request", bodyContent),
      });
      console.log(`Reimbursement notification sent to HOD: ${hod.email}`);
    }
  } catch (error) {
    console.error("Error sending reimbursement notification to HOD:", error);
  }
}


export async function notifyHOD(e_id, department) {
  try {
    const hods = await userModel.find({ user_type: "hod", department });
    if (!hods.length) {
      console.log(`No HODs found for department ${department}`);
      return;
    }

    for (const hod of hods) {
      const bodyContent = `
        <p style="font-size:16px;color:#333333;margin:0 0 8px;">Dear ${hod.fname || "HOD"},</p>
        <p style="font-size:14px;color:#555555;line-height:1.6;margin:0 0 24px;">
          A new FDC Application has been submitted by a faculty member from your department and is awaiting your review and recommendation.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;border-radius:6px;overflow:hidden;margin-bottom:24px;">
          ${infoRow("Employee ID", e_id)}
          ${infoRow("Department", department)}
          ${infoRow("Current Status", "Pending HOD Review")}
        </table>

        <div style="background-color:#fff8e1;border-left:4px solid #f9a825;padding:12px 16px;border-radius:4px;margin-bottom:24px;">
          <p style="margin:0;font-size:13px;color:#e65100;">
            <strong>Action Required:</strong> Please log in to the FDC portal to review the application and provide your recommendation.
          </p>
        </div>

        <p style="font-size:13px;color:#777777;margin:0;">
          Warm regards,<br/>
          <strong style="color:#333333;">KJSCE FDC Portal</strong><br/>
          K J Somaiya College of Engineering, Somaiya Vidyavihar University
        </p>
      `;

      await transporter.sendMail({
        from: `"KJSCE FDC Portal" <${process.env.MAIL_USER}>`,
        to: hod.email,
        subject: `[Action Required] New FDC Application from Your Department`,
        html: emailLayout("New FDC Application", bodyContent),
      });
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

    let roleDisplay = "";
    if (status.includes("hod")) roleDisplay = "HOD";
    else if (status.includes("fdc")) roleDisplay = "FDC";
    else roleDisplay = "Reviewer";

    const isApproved = status.startsWith("approved");
    const statusText = isApproved ? `Approved by ${roleDisplay}` : `Rejected by ${roleDisplay}`;

    const hodRemarkRow = form.HOD_reason ? infoRow("HOD Remarks", form.HOD_reason) : "";

    const bodyContent = `
      <p style="font-size:16px;color:#333333;margin:0 0 8px;">Dear ${user.fname || "Faculty Member"},</p>
      <p style="font-size:14px;color:#555555;line-height:1.6;margin:0 0 24px;">
        Your FDC Reimbursement Request has been reviewed. Please find the details below.
      </p>

      <p style="margin:0 0 16px;">Status: ${statusBadge(isApproved)}</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;border-radius:6px;overflow:hidden;margin-bottom:24px;">
        ${infoRow("Applicant Name", `${user.fname} ${user.lname}`)}
        ${infoRow("Employee ID", user.e_id)}
        ${infoRow("Reimbursement ID", form._id)}
        ${form.application_id ? infoRow("Program / Event", form.application_id.purpose) : ""}
        ${form.application_id ? infoRow("Organizing Institution", form.application_id.org_institution) : ""}
        ${infoRow("Review Stage", statusText)}
        ${hodRemarkRow}
      </table>

      ${!isApproved ? `
      <div style="background-color:#fdecea;border-left:4px solid #dc3545;padding:12px 16px;border-radius:4px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#b71c1c;">
          If you have concerns regarding this decision, please contact the FDC office directly.
        </p>
      </div>` : ""}

      <p style="font-size:13px;color:#777777;margin:0;">
        Warm regards,<br/>
        <strong style="color:#333333;">KJSCE Faculty Development Cell</strong><br/>
        K J Somaiya College of Engineering, Somaiya Vidyavihar University
      </p>
    `;

    await transporter.sendMail({
      from: `"KJSCE FDC Portal" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: `[FDC Reimbursement] ${statusText} — ${form.application_id?.purpose || "Your Request"}`,
      html: emailLayout(`FDC Reimbursement ${statusText}`, bodyContent),
    });
    console.log(`Reimbursement status mail sent to ${user.email}`);
  } catch (err) {
    console.error("Error sending reimbursement mail:", err);
  }
}
