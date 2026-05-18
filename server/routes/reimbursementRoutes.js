import express from "express";
import multer from "multer";
import authenticateToken from "../middlewares/authenticateToken.js";
import { reimbursementModel } from "../models/Reimbursement.js";
import userModel from "../models/User.js";
import { saveTempFile, deleteFile, uploadFile } from "../utils/upload.js";
import { sendStatusMailReimbursement, notifyNextReviewer, notifyHODReimbursement } from "../utils/nodemailer.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.post(
  '/submit-form',
  authenticateToken,
  upload.fields([{ name: "attachment", maxCount: 1 }]),
  async (req, res) => {
    try {
      const e_id = req.user.e_id;
      const currentUser = await userModel.findOne({ e_id });
      if (!currentUser) return res.status(404).json({ message: "User Not Found" });

      const timestamp = Date.now();
      let receiptZipUrl = null;
      let receiptPath;

      if (
        req.files.attachment &&
        req.files.attachment.length > 0
      ) {
        receiptPath = await saveTempFile(
          req.files.attachment[0].buffer,
          `${timestamp}_receipts.zip`
        );

        try {
          receiptZipUrl = await uploadFile(
            receiptPath,
            "fdc/reimbursements",
            "raw"
          );
        } finally {
          try {
            if (receiptPath) await deleteFile(receiptPath);
          } catch (cleanupErr) {
            console.error("Failed to delete temp receipt file:", cleanupErr);
          }
        }
      }

      const reimbursementData = {
        submitted_by: currentUser._id,
        application_id: req.body.application_id,
        registration_amount: req.body.registration_amount,
        ta_amount: req.body.ta_amount,
        da_amount: req.body.da_amount,
        status: "pending",
        ...(receiptZipUrl && { attachment: receiptZipUrl }),
      };

      const reimbursement = await reimbursementModel.create(reimbursementData);
      await notifyHODReimbursement(e_id, currentUser.department);

      res.status(201).json({
        message: "Reimbursement request submitted successfully",
        reimbursement,
      });

    } catch (error) {
      console.error("Error submitting reimbursement:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);



router.get("/fetch-reimbursement-forms", authenticateToken, async(req, res) => {
    try {
        const userType = req.user.user_type;
        const e_id = req.user.e_id;
        if(userType == "employee"){
            const currentUser = await userModel.findOne({ e_id });

            if (!currentUser) {
                return res.status(404).json({ message: "User not found" });
            }
        
            const forms = await reimbursementModel.find({ submitted_by: currentUser._id }).sort({ createdAt: -1 });
            return res.status(200).json({ forms });
        }

        else if(userType == "hod"){
            const currentUser = await userModel.findOne({ e_id });
            if (!currentUser) {
                return res.status(404).json({ message: "User not found" });
            }

            const forms = await reimbursementModel.find({
                status: { $in: ["pending", "rejected-by-hod", "approved-by-hod", "approved-by-fdc", "rejected-by-fdc"] }
            })
            .populate("submitted_by")
            .sort({ createdAt: -1 })
            .then(apps =>
                apps.filter(app => app.submitted_by.department === currentUser.department)
            );
            return res.status(200).json({ forms });
        }
        else if(userType == "fdc"){

            const forms = await reimbursementModel.find({
                status: { $in: ["approved-by-hod", "rejected-by-fdc", "approved-by-fdc"] }
            }).sort({ createdAt: -1 });

            return res.status(200).json({ forms });
        }
        else{
          return res.status(400).json("Unauthorized.");
        }
    } catch (error) {
        console.log(error);
        res.status(501).json({message: "Server Error Occured."})
    }
});


router.post('/reimbursement-review', authenticateToken, async(req, res) =>{

    try {
        let approveStatus;
        let rejectStatus;
        const userType = req.user.user_type;

        if(userType == "hod"){
          approveStatus = "approved-by-hod";
          rejectStatus = "rejected-by-hod";
        }

        else if(userType == "fdc"){
          approveStatus = "approved-by-fdc";
          rejectStatus = "rejected-by-fdc";
        }

        else{
          return res.status(401).json({message: "User unauthorised."})
        }

        const { reimbursementId, status, HOD_reason } = req.body;
        if (!reimbursementId || !status) {
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

        const updateFields = {
          status: finalStatus,
        };
    
        // Only HOD can set HOD_reason (and only include it if provided)
        if (userType === 'hod' && typeof HOD_reason === 'string' && HOD_reason.trim() !== '') {
          updateFields.HOD_reason = HOD_reason.trim();
        }

        const updatedForm = await reimbursementModel.findByIdAndUpdate(
          reimbursementId,
          { $set: updateFields },
          { new: true }
        ).populate({ path: "submitted_by" }).populate({ path: "application_id" });

        if (!updatedForm) {
          return res.status(404).json({ message: "Reimbursement Form not found." });
        }

        try {
          await sendStatusMailReimbursement(reimbursementId, finalStatus, updatedForm.submitted_by._id);
        } catch (mailErr) {
          console.error('Error sending status email for reimbursement:', mailErr);
        }

        if (status === "approve") {
          await notifyNextReviewer(userType, "reimbursement", updatedForm.submitted_by.department, updatedForm);
        }
        res.status(200).json({ message: `Reimbursement Form ${finalStatus}.`, form: updatedForm });
    


    } catch (error) {
        console.log("Error in Application Review:", error)
        res.status(501).json({message: "Server Error."})
    }
})


router.post("/fetch-reimbursement-by-id", authenticateToken, async(req, res) => {
  try {

    const userType = req.user.user_type;
    const reimbursement_id = req.body.reimbursement_id;
    const form = await reimbursementModel.findById(reimbursement_id).populate("submitted_by")

    if(userType == "hod" || userType=="fdc"){
      
      return res.status(200).json(form)
    }
    else{
      const e_id = req.user.e_id;
      const currentUser = await userModel.findOne({ e_id });
      if(application.submitted_by._id.equals(currentUser._id)){
        return res.status(200).json(form)
      }
      return res.status(403).json({ message: "Unauthorised" });
    }

  } catch (error) {
    console.log(error);
    res.status(501).json({message: "Server Error Occured."})
  }
})


export default router;