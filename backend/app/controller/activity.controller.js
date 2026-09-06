import { ActivityModel } from "../model/activity/activity.model.js";

export async function logAdminActivity({ email = "admin@kraviona.site", name = "Admin", action, target = "", details = "", status = "success", ip = "" }) {
  try {
    await ActivityModel.create({
      adminEmail: email,
      adminName: name,
      action,
      target,
      details,
      status,
      ip: ip ? ip.slice(0, 45) : "",
    });
  } catch (err) {
    console.error("Failed to log admin activity:", err.message);
  }
}

export async function listActivity(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.action) filter.action = req.query.action;
    if (req.query.status) filter.status = req.query.status;

    const [logs, total] = await Promise.all([
      ActivityModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ActivityModel.countDocuments(filter),
    ]);

    res.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Error listing activity:", error);
    res.status(500).json({ message: "Failed to retrieve activity logs" });
  }
}
