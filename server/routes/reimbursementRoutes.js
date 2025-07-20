import express from "express";
import multer from "multer";
import authenticateToken from "../middlewares/authenticateToken.js";
import { reimbursementModel } from "../models/Reimbursement.js";
import userModel from "../models/User.js";
import { saveTempFile, deleteFile, uploadFile } from "../utils/upload.js";
import { sendStatusMailReimbursement } from "../utils/nodemailer.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.post('/submit-form', authenticateToken, 

    upload.fields([
    { name: "attachment", maxCount: 1 },
  ]), 
  
  async (req, res) => {
    try {
        const e_id = req.user.e_id;
        const currentUser = await userModel.findOne({ e_id });
        if(!currentUser) return res.status(400).json({message: "User Not Found"});   

        const timestamp = Date.now();

        const loadPath = await saveTempFile(
            req.files.attachment[0].buffer,
            `${timestamp}_attachment.pdf`
          );

        const reimbursementData = {
            submitted_by: currentUser._id,
            application_id: req.body.application_id,
            registration_amount: req.body.registration_amount,
            ta_amount: req.body.ta_amount,
            da_amount: req.body.da_amount,
            status: "pending",

        }
    } catch (error) {
        
    }
})


router.get("/fetch-reimbursement-forms", authenticateToken, async(req, res) => {
    try {
        const userType = req.user.user_type;
        const e_id = req.user.e_id;
        if(userType == "employee"){
            const currentUser = await userModel.findOne({ e_id });

            if (!currentUser) {
                return res.status(404).json({ message: "User not found" });
            }
        
            const forms = await reimbursementModel.find({ submitted_by: currentUser._id });
            return res.status(200).json({ forms });
        }

        else if(userType == "hod"){
            const currentUser = await userModel.findOne({ e_id });
            if (!currentUser) {
                return res.status(404).json({ message: "User not found" });
            }

            const forms = await reimbursementModel.find({
                status: { $in: ["pending", "rejected-by-hod"] }
            })
            .populate("submitted_by") // populate to access department
            .then(apps =>
                apps.filter(app => app.submitted_by.department === currentUser.department)
            );
            return res.status(200).json({ forms });
        }
        else if(userType == "fdc-convenor"){

            const forms = await reimbursementModel.find({
                status: { $in: ["approved-by-hod", "rejected-by-convenor"] }
            });
            
            return res.status(200).json({ forms });
        }
        else if(userType == "principal"){
            const forms = await reimbursementModel.find({
                status: { $in: ["approved-by-convenor", "rejected-by-principal"] }
            });
            
            return res.status(200).json({ forms });
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

        else if(userType == "fdc-convenor"){
          approveStatus = "approved-by-convenor";
          rejectStatus = "rejected-by-convenor";
        }

        else if(userType == "principal"){
          approveStatus = "approved-by-principal";
          rejectStatus = "rejected-by-principal";
        }else{
          return res.status(401).json({message: "User unauthorised."})
        }

        const { reimbursementId, status } = req.body;
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

        const updatedForm = await reimbursementModel.findByIdAndUpdate(
          reimbursementId,
          { $set: {status: finalStatus} },
          { new: true }
        );
    
        if (!updatedForm) {
          return res.status(404).json({ message: "Reimbursement Form not found." });
        }
        await sendStatusMailReimbursement(reimbursementId, finalStatus, updatedForm.submitted_by);
        if (status === "approve") {
          await notifyNextReviewer(userType, "reimbursement");
        }
        res.status(200).json({ message: `Application ${finalStatus}.`, application: updatedApp });
    


    } catch (error) {
        console.log("Error in Application Review:", error)
        res.status(501).json({message: "Server Error."})
    }
})

export default router;