import mongoose, { Schema } from "mongoose";

const reimbursementSchema = new Schema({
    application_id:{
        type: Number,
        unique: true,
        required: true,
    },
    e_id: {
        type: String,
        required: true
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
    attachments:{
        type:String,
        required: true
    },
    status:{
        type: String,
        required: true
    }

    
}, {timestamps: { createdAt: true, updatedAt: false }})

export const reimbursementModel = mongoose.model('Reimbursement', reimbursementSchema)