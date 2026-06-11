import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CategoriesService } from '../../../services/categories.service';
import { InventoryService } from '../../../services/inventory.service';
import { ProductsService } from '../../../services/products.service';
import { Category } from '../../../models/category.model';
import { InventoryItem } from '../../../models/inventory.model';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  protected readonly products = signal<Product[]>([]);
  protected readonly categories = signal<Category[]>([]);
  protected readonly inventoryByProductId = signal<Map<string, InventoryItem>>(new Map());
  protected readonly confirmationProduct = signal<Product | null>(null);
  protected readonly isConfirmVisible = signal(false);
  protected readonly restockProduct = signal<Product | null>(null);
  protected readonly isRestockVisible = signal(false);
  protected readonly restockQuantity = signal(1);
  protected readonly restockNotes = signal('');
  protected readonly isRestocking = signal(false);
  protected readonly restockError = signal('');
  protected readonly isLoading = signal(true);
  protected readonly error = signal('');

  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly inventoryService: InventoryService,
  ) {
    this.loadCategories();
    this.loadData();
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

  private loadData(): void {
    this.isLoading.set(true);
    this.error.set('');

    forkJoin({
      products: this.productsService.getProducts(),
      inventory: this.inventoryService.getAll(),
    }).subscribe({
      next: ({ products, inventory }) => {
        this.products.set(products || []);
        this.inventoryByProductId.set(this.buildInventoryMap(inventory || []));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando productos o inventario', err);
        this.error.set('No se pudo cargar la lista de productos.');
        this.isLoading.set(false);
      },
    });
  }

  private buildInventoryMap(items: InventoryItem[]): Map<string, InventoryItem> {
    const map = new Map<string, InventoryItem>();
    for (const item of items) {
      map.set(String(item.id_product), item);
    }
    return map;
  }

  protected getCategoryName(categoryId: string): string {
    return this.categories().find((category) => category.id === categoryId)?.name ?? categoryId;
  }

  protected getAvailable(productId: string | number): number {
    return this.inventoryByProductId().get(String(productId))?.available ?? 0;
  }

  protected isOutOfStock(productId: string | number): boolean {
    const item = this.inventoryByProductId().get(String(productId));
    return item?.is_out_of_stock ?? false;
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
        this.inventoryByProductId.update((map) => {
          const next = new Map(map);
          next.delete(String(product.id));
          return next;
        });
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

  protected openRestockModal(product: Product): void {
    this.restockProduct.set(product);
    this.restockQuantity.set(1);
    this.restockNotes.set('');
    this.restockError.set('');
    this.isRestockVisible.set(true);
  }

  protected closeRestockModal(): void {
    this.isRestockVisible.set(false);
    this.restockProduct.set(null);
    this.restockError.set('');
    this.isRestocking.set(false);
  }

  protected confirmRestock(): void {
    const product = this.restockProduct();
    const quantity = this.restockQuantity();

    if (!product) {
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      this.restockError.set('La cantidad debe ser un número entero mayor a 0.');
      return;
    }

    this.isRestocking.set(true);
    this.restockError.set('');

    const notes = this.restockNotes().trim();

    this.inventoryService
      .restock(Number(product.id), {
        quantity,
        notes: notes || undefined,
      })
      .subscribe({
        next: (updated) => {
          this.inventoryByProductId.update((map) => {
            const next = new Map(map);
            next.set(String(updated.id_product), updated);
            return next;
          });
          this.closeRestockModal();
        },
        error: (err) => {
          const serverMessage =
            (err?.error as { message?: string })?.message ||
            'No se pudo ingresar el stock.';
          this.restockError.set(serverMessage);
          this.isRestocking.set(false);
        },
      });
  }
}
