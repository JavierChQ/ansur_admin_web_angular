import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ORDERS_URL } from '../../api.config';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private readonly http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(ORDERS_URL);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${ORDERS_URL}/detail/${id}`);
  }

  markDispatched(id: number): Observable<Order> {
    return this.http.put<Order>(`${ORDERS_URL}/update-dispatched/${id}`, {});
  }
}
