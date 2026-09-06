import { ToolOverrideModel } from "../model/tools/tool-override.model.js";
import { EventModel } from "../model/analytics/event.model.js";
import { logAdminActivity } from "./activity.controller.js";

export async function listTools(req, res) {
  try {
    const overrides = await ToolOverrideModel.find().lean();
    const overrideMap = new Map(overrides.map((o) => [o.slug, o]));

    // Aggregate tool usage stats
    const usageStats = await EventModel.aggregate([
      { $match: { type: "tool_use" } },
      { $group: { _id: "$toolSlug", totalUses: { $sum: 1 }, uniqueUsers: { $addToSet: "$visitorHash" } } },
    ]);

    const usageMap = new Map(
      usageStats.map((u) => [u._id, { uses: u.totalUses, uniqueUsers: u.uniqueUsers.length }])
    );

    res.json({
      overrides: overrides,
      usageStats: Object.fromEntries(usageMap),
    });
  } catch (error) {
    console.error("Error listing tools:", error);
    res.status(500).json({ message: "Failed to list tools" });
  }
}

export async function updateTool(req, res) {
  try {
    const { slug } = req.params;
    const { name, category, status, featured, customTitle, customDescription, notes } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (category !== undefined) updates.category = category;
    if (status !== undefined) updates.status = status;
    if (featured !== undefined) updates.featured = Boolean(featured);
    if (customTitle !== undefined) updates.customTitle = customTitle;
    if (customDescription !== undefined) updates.customDescription = customDescription;
    if (notes !== undefined) updates.notes = notes;

    const tool = await ToolOverrideModel.findOneAndUpdate(
      { slug },
      { $set: updates },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    await logAdminActivity({
      email: req.user?.email || "admin@kraviona.site",
      name: req.user?.name || "Admin",
      action: "tool_updated",
      target: slug,
      details: `Status set to ${status || tool.status}`,
    });

    res.json({ tool });
  } catch (error) {
    console.error("Error updating tool:", error);
    res.status(500).json({ message: "Failed to update tool" });
  }
}
