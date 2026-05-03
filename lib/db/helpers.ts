import { Types } from "mongoose";
import { LOW_STOCK_THRESHOLD } from "../constants";

export function normalizeInventoryStatus(quantityKg: number) {
  if (quantityKg <= 0) {
    return "Нет в наличии";
  }

  if (quantityKg <= LOW_STOCK_THRESHOLD) {
    return "Низкий остаток";
  }

  return "В наличии";
}

export function toObjectId(id: string) {
  return new Types.ObjectId(id);
}
