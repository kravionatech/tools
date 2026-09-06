import apiClient from "./api.client";
import { CustomCodeConfig } from "@/types";

export interface CustomCodeResponse {
  customCode: CustomCodeConfig;
}

export interface ValidateCodeResponse {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export const customCodeService = {
  async getCustomCode(token?: string | null): Promise<CustomCodeResponse> {
    return apiClient<CustomCodeResponse>("/api/settings/custom-code", { token });
  },

  async updateCustomCode(
    data: Partial<CustomCodeConfig>,
    token?: string | null
  ): Promise<{ message: string; customCode: CustomCodeConfig }> {
    return apiClient<{ message: string; customCode: CustomCodeConfig }>(
      "/api/settings/custom-code",
      {
        method: "PUT",
        body: JSON.stringify(data),
        token,
      }
    );
  },

  async validateCode(
    code: string,
    token?: string | null
  ): Promise<ValidateCodeResponse> {
    return apiClient<ValidateCodeResponse>("/api/settings/custom-code/validate", {
      method: "POST",
      body: JSON.stringify({ code }),
      token,
    });
  },

  async getPublicCustomCode(): Promise<Record<string, unknown>> {
    return apiClient<Record<string, unknown>>("/api/settings/custom-code/public");
  },
};

export default customCodeService;
