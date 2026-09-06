import mongoose from "mongoose";

const apiConfigSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true, trim: true, maxlength: 100 },
    endpoint: { type: String, required: true, trim: true, maxlength: 500 },
    secretEnvName: { type: String, required: true, trim: true, maxlength: 100 },
    enabled: { type: Boolean, default: false },
    requestLimit: { type: Number, min: 0, default: 0 },
    notes: { type: String, maxlength: 1000, default: "" },
  },
  { timestamps: true }
);

export const ApiConfigModel = mongoose.models.ApiConfig || mongoose.model("ApiConfig", apiConfigSchema);
