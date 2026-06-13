export type OrderStatus =
  | 'PENDIENTE_PAGO'
  | 'PAGADO'
  | 'CANCELADO'
  | 'EXPIRADO'
  | 'DESPACHADO'
  | 'REEMBOLSADO';

export type DeliveryType = 'delivery' | 'pickup';

export interface OrderProductLine {
  id_product: number;
  quantity: number;
  unit_price: number;
  product?: {
    id: number;
    name: string;
    image1?: string;
    sale_price?: number;
  };
}

export interface OrderUser {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone?: string;
}

export interface OrderAddress {
  id: number;
  address: string;
  district: string;
}

export interface Order {
  id: number;
  id_client: number;
  id_address: number;
  amount: number;
  status: OrderStatus;
  expires_at?: string;
  payment_id?: string;
  created_at: string;
  updated_at?: string;
  delivery_type?: DeliveryType | string;
  delivery_fee?: number;
  customer_name?: string;
  customer_lastname?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_doc_type?: string;
  customer_doc_number?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  direccion?: string;
  referencia?: string;
  receptor_type?: string;
  receptor_nombres?: string;
  receptor_apellidos?: string;
  receptor_doc_type?: string;
  receptor_doc_number?: string;
  user?: OrderUser;
  address?: OrderAddress;
  orderHasProducts?: OrderProductLine[];
}
