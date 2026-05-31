import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  getOrders(): Promise<Order[]> {
    return Promise.resolve([]);
  }

  getOrderById(id: string): Promise<Order | null> {
    return Promise.resolve(null);
  }
}
