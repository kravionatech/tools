"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface AdminContextValue {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  days: number;
  setDays: (days: number) => void;
  refreshKey: number;
  triggerRefresh: () => void;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: "success" | "error" | "info" | "warning") => void;
  removeToast: (id: string) => void;
  apiBase: string;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

const rawApiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export const API_BASE = rawApiBase.replace(/\/api\/?$/, "");

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [days, setDays] = useState<number>(30);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("kraviona_admin_token");
      const storedUser = localStorage.getItem("kraviona_admin_user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to parse admin session:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    showToast("Data refreshed", "info");
  };

  const login = (newToken: string, newUser: AdminUser) => {
    setToken(newToken);
    setUser(newUser);
    try {
      localStorage.setItem("kraviona_admin_token", newToken);
      localStorage.setItem("kraviona_admin_user", JSON.stringify(newUser));
    } catch {}
    showToast(`Welcome back, ${newUser.name || "Admin"}`, "success");
    router.push("/admin");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem("kraviona_admin_token");
      localStorage.removeItem("kraviona_admin_user");
    } catch {}
    showToast("Logged out successfully", "info");
    router.push("/admin/login");
  };

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        token,
        isLoading,
        days,
        setDays,
        refreshKey,
        triggerRefresh,
        login,
        logout,
        toasts,
        showToast,
        removeToast,
        apiBase: API_BASE,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
