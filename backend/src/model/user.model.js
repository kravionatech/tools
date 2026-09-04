import mongoose from "mongoose";
const schema = new mongoose.Schema({ name: { type: String, required: true, trim: true }, email: { type: String, required: true, unique: true, lowercase: true, trim: true }, password: { type: String, required: true, select: false }, role: { type: String, enum: ["admin", "user"], default: "user" }, status: { type: String, enum: ["active", "deleted"], default: "active" }, deletedAt: { type: Date, default: null } }, { timestamps: true, versionKey: false });
export default mongoose.models.User || mongoose.model("User", schema);
