import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../../services/categories.service';
import { ProductsService } from '../../../services/products.service';
import { Category } from '../../../models/category.model';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  protected readonly products = signal<Product[]>([]);
  protected readonly categories = signal<Category[]>([]);
  protected readonly confirmationProduct = signal<Product | null>(null);
  protected readonly isConfirmVisible = signal(false);
  protected readonly isLoading = signal(true);
  protected readonly error = signal('');

  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService
  ) {
    this.loadCategories();
    this.loadProducts();
  }

  private loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data || []);
      },
      error: (error) => {
        console.error('Error cargando categorías', error);
      },
    });
  }

  private loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data || []);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando productos', error);
        this.error.set('No se pudo cargar la lista de productos.');
        this.isLoading.set(false);
      },
    });
  }

  protected getCategoryName(categoryId: string): string {
    return this.categories().find((category) => category.id === categoryId)?.name ?? categoryId;
  }

  protected promptDeleteProduct(product: Product): void {
    this.confirmationProduct.set(product);
    this.isConfirmVisible.set(true);
  }

  protected confirmDeleteProduct(): void {
    const product = this.confirmationProduct();
    if (!product) {
      return;
    }

    this.productsService.deleteProduct(product.id).subscribe({
      next: () => {
        this.products.update((list: Product[]) => list.filter((item: Product) => item.id !== product.id));
        this.closeDeleteConfirmation();
      },
      error: (err) => {
        const serverMessage =
          (err?.error as { message?: string })?.message ||
          'No se pudo eliminar el producto.';
        this.error.set(serverMessage);
        this.closeDeleteConfirmation();
      },
    });
  }

  protected closeDeleteConfirmation(): void {
    this.isConfirmVisible.set(false);
    this.confirmationProduct.set(null);
  }
}
