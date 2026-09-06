import apiClient from "./api.client";
import { AnalyticsStats } from "@/types";

export const analyticsService = {
  async getOverview(days: number = 30, token?: string | null): Promise<AnalyticsStats> {
    return apiClient<AnalyticsStats>("/api/analytics/overview", {
      params: { days },
      token,
    });
  },

  async getVisitors(days: number = 30, token?: string | null): Promise<any> {
    return apiClient("/api/analytics/visitors", {
      params: { days },
      token,
    });
  },

  async trackEvent(eventData: {
    eventType: string;
    path: string;
    referrer?: string;
    toolSlug?: string;
  }): Promise<{ recorded: boolean }> {
    return apiClient<{ recorded: boolean }>("/api/analytics/track", {
      method: "POST",
      body: JSON.stringify(eventData),
    });
  },
};

export default analyticsService;
