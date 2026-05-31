import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';
import { CATEGORY_URL } from '../../api.config';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private readonly http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(CATEGORY_URL);
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${CATEGORY_URL}/${id}`);
  }

  createCategory(category: FormData): Observable<Category> {
    return this.http.post<Category>(CATEGORY_URL, category);
  }

  updateCategory(id: string, category: FormData): Observable<Category> {
    return this.http.put<Category>(`${CATEGORY_URL}/${id}`, category);
  }

  updateCategoryWithImage(id: string, category: FormData): Observable<Category> {
    return this.http.put<Category>(`${CATEGORY_URL}/upload/${id}`, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${CATEGORY_URL}/${id}`);
  }
}
