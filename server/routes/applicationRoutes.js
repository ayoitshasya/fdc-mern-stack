import express from "express";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import cloudinary from "../utils/cloudinary.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import { applicationModel } from "../models/Application.js";
import userModel from "../models/User.js";

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
  "/application-form",
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
      res.status(201).json({ message: "Application submitted successfully", application });
    } catch (error) {
      console.error("Error submitting application:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;
