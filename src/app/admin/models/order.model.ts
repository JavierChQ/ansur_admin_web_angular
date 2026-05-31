export interface Order {
  id: string;
  customerId: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
}
