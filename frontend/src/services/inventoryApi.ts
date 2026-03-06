import axios from "axios";
import type { InventoryItem } from "@/types/inventory";

const API_BASE = "http://localhost:8081/api/inventory";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json"
  }
});

export const getAllInventory = () =>
  api.get<InventoryItem[]>("/all").then((res) => res.data);

export const addInventory = (
  item: Omit<InventoryItem, "id" | "lastUpdated">
) =>
  api.post<InventoryItem>("/add", item).then((res) => res.data);

export const updateInventory = (
  id: number,
  item: Omit<InventoryItem, "id" | "lastUpdated">
) =>
  api.put<InventoryItem>(`/update/${id}`, item).then((res) => res.data);

export const restockInventory = (id: number, newQuantity: number) =>
  api
    .put<InventoryItem>(`/restock/${id}`, null, { params: { newQuantity } })
    .then((res) => res.data);

export const deleteInventory = (id: number) =>
  api.delete(`/delete/${id}`).then((res) => res.data);