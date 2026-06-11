export interface InventoryItem {
  id_product: number;
  name: string;
  quantity: number;
  reserved: number;
  available: number;
  is_out_of_stock: boolean;
}

export interface RestockPayload {
  quantity: number;
  notes?: string;
}
