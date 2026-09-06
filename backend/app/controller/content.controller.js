import { ContentModel } from "../model/content/content.model.js";
import { logAdminActivity } from "./activity.controller.js";

export async function getContent(req, res) {
  try {
    const { section } = req.params;
    const content = await ContentModel.findOne({ section }).lean();
    res.json({ section, content: content ? content.data : null, title: content?.title || "", subtitle: content?.subtitle || "" });
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ message: "Failed to fetch content" });
  }
}

export async function updateContent(req, res) {
  try {
    const { section } = req.params;
    const { title, subtitle, data } = req.body;

    const content = await ContentModel.findOneAndUpdate(
      { section },
      { $set: { section, title: title || "", subtitle: subtitle || "", data: data || {}, updatedBy: req.user?.email || "admin" } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    await logAdminActivity({
      email: req.user?.email || "admin@kraviona.site",
      name: req.user?.name || "Admin",
      action: "content_updated",
      target: section,
      details: `Updated ${section} content section`,
    });

    res.json({ content });
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({ message: "Failed to update content" });
  }
}

export async function listAllContent(_req, res) {
  try {
    const sections = await ContentModel.find().lean();
    res.json({ sections });
  } catch (error) {
    console.error("Error listing content:", error);
    res.status(500).json({ message: "Failed to list content" });
  }
}
