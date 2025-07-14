import express from "express";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import cloudinary from "../utils/cloudinary.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import { applicationModel } from "../models/Application.js";
import userModel from "../models/User.js";
import { sendStatusMail, notifyNextReviewer, notifyHOD } from "../utils/nodemailer.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const saveTempFile = async (buffer, fileName) => {
  const tempDir = "./temp";
  await fs.mkdir(tempDir, { recursive: true });
  const filePath = path.join(tempDir, fileName);
  await fs.writeFile(filePath, buffer);
  return filePath;
};

const uploadFile = async (filePath, folder, resourceType = "raw") => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: resourceType,
    use_filename: true,
    type: "upload",
  });
  return result.secure_url;
};

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.error("Error deleting temp file:", filePath, err.message);
  }
};

router.post(
  "/submit-form",
  authenticateToken,
  upload.fields([
    { name: "load_adjustment_file", maxCount: 1 },
    { name: "conference_brochure_file", maxCount: 1 },
    { name: "email_upload_file", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const e_id = req.user.e_id;
      const currentUser = await userModel.findOne({ e_id });

      const timestamp = Date.now();

      const loadPath = await saveTempFile(
        req.files.load_adjustment_file[0].buffer,
        `${timestamp}_load.pdf`
      );
      const brochurePath = await saveTempFile(
        req.files.conference_brochure_file[0].buffer,
        `${timestamp}_brochure.pdf`
      );
      const emailPath = await saveTempFile(
        req.files.email_upload_file[0].buffer,
        `${timestamp}_email.png`
      );

      const loadAdjustmentUrl = await uploadFile(loadPath, "fdc/load_adjustment", "raw");
      const brochureUrl = await uploadFile(brochurePath, "fdc/conference_brochure", "raw");
      const emailImageUrl = await uploadFile(emailPath, "fdc/email_upload", "image");

      await Promise.all([
        deleteFile(loadPath),
        deleteFile(brochurePath),
        deleteFile(emailPath),
      ]);

      const applicationData = {
        submitted_by: currentUser._id,
        purpose: req.body.purpose,
        org_institution: req.body.org_institution,
        supporting_org: req.body.supporting_org,
        duration_from: req.body.duration_from,
        duration_to: req.body.duration_to,
        total_days: req.body.total_days,
        registration_last_day: req.body.registration_last_day,
        registration_fee: req.body.registration_fee,
        vacation_period: req.body.vacation_period,
        ods_required: req.body.ods_required,
        load_adjustment_path: loadAdjustmentUrl,
        conference_brochure_path: brochureUrl,
        email_upload_path: emailImageUrl,
        amount_claimed: req.body.amount_claimed,
        year: req.body.year,
        total_ods: req.body.total_ods,
        od_year: req.body.od_year,
        purpose_scope: req.body.purpose_scope,
        status: "pending",
      };

      const application = await applicationModel.create(applicationData);
      await notifyHOD(e_id, currentUser.department)
      res.status(201).json({ message: "Application submitted successfully", application });
    } catch (error) {
      console.error("Error submitting application:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);


router.get("/fetch-applications", authenticateToken, async(req, res) => {
    try {
        const userType = req.user.user_type;
        const e_id = req.user.e_id;
        if(userType == "employee"){
            const currentUser = await userModel.findOne({ e_id });

            if (!currentUser) {
                return res.status(404).json({ message: "User not found" });
            }
        
            const applications = await applicationModel.find({ submitted_by: currentUser._id });
            return res.status(200).json({ applications });
        }

        else if(userType == "hod"){
            const currentUser = await userModel.findOne({ e_id });
            if (!currentUser) {
                return res.status(404).json({ message: "User not found" });
            }

            const applications = await applicationModel.find({
                status: { $in: ["pending", "rejected-by-hod"] }
            })
            .populate("submitted_by") // populate to access department
            .then(apps =>
                apps.filter(app => app.submitted_by.department === currentUser.department)
            );
            return res.status(200).json({ applications });
        }
        else if(userType == "fdc-convenor"){

            const applications = await applicationModel.find({
                status: { $in: ["approved-by-hod", "rejected-by-convenor"] }
            });
            
            return res.status(200).json({ applications });
        }
        else if(userType == "principal"){
            const applications = await applicationModel.find({
                status: { $in: ["approved-by-convenor", "rejected-by-principal"] }
            });
            
            return res.status(200).json({ applications });
        }
    } catch (error) {
        console.log(error);
        res.status(501).json({message: "Server Error Occured."})
    }
});

router.post('/application-review', authenticateToken, async(req, res) =>{

    try {
        let approveStatus;
        let rejectStatus;
        const userType = req.user.user_type;
        let updateObject = {};

        if(userType == "hod"){

          approveStatus = "approved-by-hod";
          rejectStatus = "rejected-by-hod";
          const { HOD_recommendation, HOD_reason } = req.body;
          if (!HOD_recommendation || !HOD_reason) {
            return res.status(400).json({ message: "Missing required fields." });
          }
          updateObject.HOD_recommendation = HOD_recommendation;
          updateObject.HOD_reason = HOD_reason;

        }
        else if(userType == "fdc-convenor"){

          approveStatus = "approved-by-convenor";
          rejectStatus = "rejected-by-convenor";
          const { date_of_meeting, final_recommendation } = req.body;
          if (!date_of_meeting || !final_recommendation) {
            return res.status(400).json({ message: "Missing required fields." });
          }
          updateObject.date_of_meeting = date_of_meeting;
          updateObject.final_recommendation = final_recommendation;

        }
        else if(userType == "principal"){

          approveStatus = "approved-by-principal";
          rejectStatus = "rejected-by-principal";
          const { amount_sanctioned, od_sanctioned } = req.body;
          if (amount_sanctioned == null || od_sanctioned == null) {
            return res.status(400).json({ message: "Missing required fields." });
          }
          updateObject.amount_sanctioned = amount_sanctioned;
          updateObject.od_sanctioned = od_sanctioned;

        }else{
          return res.status(401).json({message: "User unauthorised."})
        }

        const { applicationId, status } = req.body;
        if (!applicationId || !status) {
          return res.status(400).json({ message: "Missing required fields." });
        }
    
        let finalStatus;
        if (status === "approve") {
          finalStatus = approveStatus;
        } else if (status === "disapprove") {
          finalStatus = rejectStatus;
        } else {
          return res.status(400).json({ message: "Invalid status. Use 'approve' or 'disapprove'." });
        }

        updateObject.status = finalStatus;

        const updatedApp = await applicationModel.findByIdAndUpdate(
          applicationId,
          { $set: updateObject },
          { new: true }
        );
    
        if (!updatedApp) {
          return res.status(404).json({ message: "Application not found." });
        }
        await sendStatusMail(applicationId, finalStatus, updatedApp.submitted_by);
        if (status === "approve") {
          await notifyNextReviewer(userType);
        }
        res.status(200).json({ message: `Application ${finalStatus}.`, application: updatedApp });
    


    } catch (error) {
        console.log("Error in Application Review:", error)
        res.status(501).json({message: "Server Error."})
    }
})

export default router;
