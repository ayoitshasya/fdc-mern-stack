import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    e_id: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
    },
    department: {
        type:String,
        enum: ['COMPS', 'IT', 'EXTC', 'SAH', 'EXCP', 'MECH'],
        required: true
    },
    designation:{
        type: String,
        required: true
    },
    date_of_appointment:{
        type: Date,
        required: true
    },
    present_appointment:{
        type: Date,
        required: true
    },
    user_type:{
        type: String,
        enum:['employee', 'hod', 'principal', 'fdc-conveyor', 'fdc-coordinator'],
        required:true
    }

    
}, {timestamps: { createdAt: true, updatedAt: false }})


export const userModel = mongoose.model('User', userSchema)