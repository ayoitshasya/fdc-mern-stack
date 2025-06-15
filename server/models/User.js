import mongoose, { Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema(
  {
    googleId: {
      type: String,
      default: null,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
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
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Marked as not required since Google users may not have a password
    },
    department: {
      type: String,
      enum: ['COMPS', 'IT', 'EXTC', 'SAH', 'EXCP', 'MECH'],
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    date_of_appointment: {
      type: Date,
      required: true,
    },
    present_appointment: {
      type: Date,
      required: true,
    },
    user_type: {
      type: String,
      enum: ['employee', 'hod', 'principal', 'fdc-conveyor', 'fdc-coordinator'],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Enable username/password login support if needed
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email', // use email as the login field
  usernameLowerCase: true,
});

export const userModel = mongoose.model('User', userSchema);
