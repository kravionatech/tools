import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["page_view", "tool_use"], required: true, index: true },
    path: { type: String, required: true, maxlength: 500 },
    title: { type: String, maxlength: 200 },
    toolSlug: { type: String, maxlength: 120, index: true },
    referrer: { type: String, maxlength: 500 },
    deviceType: { type: String, enum: ["mobile", "tablet", "desktop", "unknown"], default: "unknown" },
    browser: { type: String, maxlength: 80 },
    os: { type: String, maxlength: 80 },
    visitorHash: { type: String, required: true, index: true },
    country: { type: String, maxlength: 2 },
    ip: { type: String, maxlength: 45 },
  },
  { timestamps: true }
);

eventSchema.index({ createdAt: -1 });
eventSchema.index({ type: 1, createdAt: -1 });

export const EventModel = mongoose.models.AnalyticsEvent || mongoose.model("AnalyticsEvent", eventSchema);
