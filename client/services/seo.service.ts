import apiClient from "./api.client";
import { RobotsConfig, LlmsConfig, SiteSettings } from "@/types";

export interface RobotsResponse {
  config: RobotsConfig;
  generated: string;
  siteUrl: string;
}

export interface LlmsResponse {
  config: LlmsConfig;
  generated: string;
  siteUrl: string;
}

export const seoService = {
  // ── Robots.txt ──
  async getRobots(token?: string | null): Promise<RobotsResponse> {
    return apiClient<RobotsResponse>("/api/settings/seo/admin/robots", { token });
  },

  async updateRobots(
    data: Partial<RobotsConfig>,
    token?: string | null
  ): Promise<{ message: string; config: RobotsConfig; generated: string }> {
    return apiClient<{ message: string; config: RobotsConfig; generated: string }>(
      "/api/settings/seo/admin/robots",
      {
        method: "PUT",
        body: JSON.stringify(data),
        token,
      }
    );
  },

  // ── LLMs.txt ──
  async getLlms(token?: string | null): Promise<LlmsResponse> {
    return apiClient<LlmsResponse>("/api/settings/seo/admin/llms", { token });
  },

  async updateLlms(
    data: Partial<LlmsConfig>,
    token?: string | null
  ): Promise<{ message: string; config: LlmsConfig; generated: string }> {
    return apiClient<{ message: string; config: LlmsConfig; generated: string }>(
      "/api/settings/seo/admin/llms",
      {
        method: "PUT",
        body: JSON.stringify(data),
        token,
      }
    );
  },

  // ── General SEO Settings ──
  async getSiteSettings(token?: string | null): Promise<{ settings: SiteSettings }> {
    return apiClient<{ settings: SiteSettings }>("/api/settings", { token });
  },

  async updateSiteSettings(
    data: Partial<SiteSettings>,
    token?: string | null
  ): Promise<{ message: string; settings: SiteSettings }> {
    return apiClient<{ message: string; settings: SiteSettings }>("/api/settings", {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    });
  },
};

export default seoService;
