export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  [key: string]: unknown; // supports backwards-compatible top-level keys
}

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: unknown;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
