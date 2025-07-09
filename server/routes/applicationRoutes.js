import authenticateToken from "../middlewares/authenticateToken";
import express from "express";
import { applicationModel } from "../models/Application";

const router = express.Router()


router.post('/application-form', authenticateToken, async (req, res)=> {
    try {
        const e_id = req.user.e_id;

        const applicationData = {
            e_id,
            department: req.body.department,
            date_of_appointment: req.body.date_of_appointment,
            present_appointment: req.body.present_appointment,
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
            load_adjustment_path: req.body.load_adjustment_path,
            conference_brochure_path: req.body.conference_brochure_path,
            email_upload_path: req.body.email_upload_path,
            amount_claimed: req.body.amount_claimed,
            year: req.body.year,
            total_ods: req.body.total_ods,
            od_year: req.body.od_year,
            purpose_scope: req.body.purpose_scope,
            status: "pending",
            designation: req.body.designation,
        };
      
        const application = await applicationModel.create(applicationData);      
        res.status(201).json({ message: "Application submitted successfully", application });

    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})


export default router;