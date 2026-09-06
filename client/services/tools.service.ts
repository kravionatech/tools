import { tools, Tool, upcomingTools, UpcomingTool } from "@/lib/tools-registry";

export const toolsService = {
  getAllTools(): Tool[] {
    return tools;
  },

  getToolBySlug(slug: string): Tool | undefined {
    return tools.find((t) => t.slug === slug);
  },

  getToolsByCategory(category: "text" | "image" | "seo"): Tool[] {
    return tools.filter((t) => t.category === category);
  },

  getUpcomingTools(): UpcomingTool[] {
    return upcomingTools;
  },
};

export default toolsService;
