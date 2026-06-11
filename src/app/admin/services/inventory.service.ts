import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ADMIN_INVENTORY_URL } from '../../api.config';
import { InventoryItem, RestockPayload } from '../models/inventory.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(ADMIN_INVENTORY_URL);
  }

  restock(productId: number, payload: RestockPayload): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(`${ADMIN_INVENTORY_URL}/${productId}/restock`, payload);
  }
}
