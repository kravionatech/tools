import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    adminEmail: { type: String, required: true, index: true },
    adminName: { type: String, default: "Admin" },
    action: { type: String, required: true, index: true }, // e.g. "settings_updated", "tool_status_changed", "api_updated", "admin_login"
    target: { type: String, default: "" }, // e.g. "Site Settings", "Image Compressor", "OpenAI API"
    details: { type: String, default: "" },
    status: { type: String, enum: ["success", "warning", "error"], default: "success" },
    ip: { type: String, default: "" },
  },
  { timestamps: true }
);

activitySchema.index({ createdAt: -1 });

export const ActivityModel = mongoose.models.Activity || mongoose.model("Activity", activitySchema);
