import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    phone: { type: Number },
    subject: { type: String },
    message: { type: String },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", ContactSchema);

export default Contact;
