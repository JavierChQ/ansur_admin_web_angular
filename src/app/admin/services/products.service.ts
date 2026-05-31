import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { PRODUCT_URL } from '../../api.config';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(PRODUCT_URL);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${PRODUCT_URL}/${id}`);
  }

  createProduct(product: FormData): Observable<Product> {
    return this.http.post<Product>(PRODUCT_URL, product);
  }

  updateProduct(id: string, product: FormData | Record<string, unknown>): Observable<Product> {
    return this.http.put<Product>(`${PRODUCT_URL}/${id}`, product);
  }

  updateProductWithImage(id: string, product: FormData): Observable<Product> {
    return this.http.put<Product>(`${PRODUCT_URL}/upload/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${PRODUCT_URL}/${id}`);
  }
}
