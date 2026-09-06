import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 80 },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
        passwordHash: { type: String, required: true, select: false },
        role: { type: String, enum: ["admin"], default: "admin" },
        lastLoginAt: { type: Date },
    },
    { timestamps: true }
);

export const AuthModel = mongoose.models.Auth || mongoose.model("Auth", authSchema);