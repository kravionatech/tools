import mongoose from "mongoose";

const toolOverrideSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, default: "other" },
    status: {
      type: String,
      enum: ["active", "upcoming", "draft", "disabled"],
      default: "active",
      index: true,
    },
    featured: { type: Boolean, default: false },
    customTitle: { type: String, default: "" },
    customDescription: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ToolOverrideModel = mongoose.models.ToolOverride || mongoose.model("ToolOverride", toolOverrideSchema);
