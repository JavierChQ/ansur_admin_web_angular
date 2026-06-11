export interface Product {
  id: string;
  name: string;
  description?: string;
  purchase_price: number;
  sale_price: number;
  price_warning?: string;
  id_category: string;
  image1?: string;
  image2?: string;
  in_stock?: boolean;
  created_at?: string;
  updated_at?: string;
}
