export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  lastLogin?: string;
}

export interface ActivityLog {
  _id: string;
  adminEmail: string;
  action: string;
  resourceType: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

export interface SystemStatus {
  service: string;
  status: "ok" | "degraded" | "down";
  timestamp: string;
  uptime?: number;
  memoryUsage?: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
  };
}

export interface AnalyticsStats {
  periodDays: number;
  totalPageViews: number;
  uniqueVisitors: number;
  topPages: { path: string; views: number }[];
  topTools: { toolSlug: string; count: number }[];
  viewsByDay: { date: string; views: number; uniqueVisitors: number }[];
}
