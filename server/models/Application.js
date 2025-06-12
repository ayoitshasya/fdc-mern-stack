import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema({
    application_id:{
        type:Number,
        unique: true,
        required: true
    },
    e_id:{
        type: String,
        required: true
    },
    purpose:{
        type:String,
        required:true
    },
    org_institution:{
        type:String,
        required:true
    },
    supporting_org:{
        type:String,
        required:true
    },
    duration_from:{
        type:Date,
        required:true
    },
    duration_to:{
        type:Date,
        required:true
    },
    total_days:{
        type:Number,
        required:true
    },
    registration_last_day:{
        type:Date,
        required:true
    },
    registration_fee:{
        type:Number,
        required:true
    },
    vacation_period:{
        type:String,
        required:true
    },
    ods_required:{
        type:Number,
        required:true
    },
    load_adjustment_path:{
        type:String,
        required:true
    },
    conference_brochure_path:{
        type:String,
        required:true
    },
    email_upload_path:{
        type:String,
        required:true
    },
    amount_claimed:{
        type:String,
        required:true
    },
    year:{
        type:Number,
        required:true
    },
    total_ods:{
        type:String,
        required:true
    },
    od_year:{
        type:Number,
        required:true
    },
    purpose_scope:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    HOD_recommendation:{
        type:String,
    },
    HOD_reason:{
        type:String,
    },
    date_of_meeting:{
        type:Date,
    },
    final_recommendation:{
        type:String,
    },
    amount_sanctioned:{
        type:Number,
    },
    designation:{
        type:String,
    },
    od_sanctioned:{
        type:Number,
    }


}, {timestamps: { createdAt: true, updatedAt: false }})

export const applicationModel = mongoose.model('Application', applicationSchema)