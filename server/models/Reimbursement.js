import mongoose, { Schema } from "mongoose";

const reimbursementSchema = new Schema({
    submitted_by:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    application_id:{
        type: mongoose.Types.ObjectId,
        ref: 'Application',
        unique: true,
        required: true,
    },
    registration_amount:{
        type: Number,
    },
    ta_amount:{
        type: Number,
    },
    da_amount:{
        type: Number,
    },
    attachment:{
        type:String
    },
    status:{
        type: String,
        enum: ["pending", "approved-by-hod", "approved-by-convenor", "approved-by-principal", "rejected-by-hod", "rejected-by-convenor", "rejected-by-principal"],
        required: true,
        default: "pending"
    }

    
}, {timestamps: { createdAt: true, updatedAt: false }})

export const reimbursementModel = mongoose.model('Reimbursement', reimbursementSchema)