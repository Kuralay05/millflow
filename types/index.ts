export type Languages = "ru" | "en" | "kk";

export type UserRole = "admin" | "operator" | "warehouse_manager";

export type EntityType =
  | "Supplier"
  | "GrainBatch"
  | "ProductionBatch"
  | "InventoryItem"
  | "Shipment";

export type SessionUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export interface Dictionary {
  [key: string]: string | Dictionary;
}
