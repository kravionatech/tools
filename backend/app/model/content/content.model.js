import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    section: { type: String, required: true, unique: true, index: true }, // e.g., "homepage", "faqs", "about", "contact", "footer"
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    updatedBy: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ContentModel = mongoose.models.Content || mongoose.model("Content", contentSchema);
