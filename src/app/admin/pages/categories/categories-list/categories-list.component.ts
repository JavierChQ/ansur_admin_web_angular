import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService } from '../../../services/categories.service';
import { Category } from '../../../models/category.model';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css'],
  host: {
    class: 'categories-page',
  },
})
export class CategoriesListComponent {
  protected readonly categories = signal<Category[]>([]);
  protected readonly error = signal('');
  protected readonly confirmationCategory = signal<Category | null>(null);
  protected readonly isConfirmVisible = signal(false);

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly router: Router
  ) {
    this.categoriesService.getCategories().subscribe({
      next: (items) => this.categories.set(items),
      error: () => this.error.set('No se pudieron cargar las categorías.'),
    });
  }

  protected navigateToNew(): void {
    this.router.navigate(['/admin/categories/new']);
  }

  protected navigateToEdit(category: Category): void {
    this.router.navigate(['/admin/categories', category.id]);
  }

  protected promptDeleteCategory(category: Category): void {
    this.confirmationCategory.set(category);
    this.isConfirmVisible.set(true);
  }

  protected confirmDeleteCategory(): void {
    const category = this.confirmationCategory();
    if (!category) {
      return;
    }

    this.categoriesService.deleteCategory(category.id).subscribe({
      next: () => {
        this.categories.update((list: Category[]) => list.filter((item: Category) => item.id !== category.id));
        this.closeDeleteConfirmation();
      },
      error: () => {
        this.error.set('No se pudo eliminar la categoría.');
        this.closeDeleteConfirmation();
      },
    });
  }

  protected closeDeleteConfirmation(): void {
    this.isConfirmVisible.set(false);
    this.confirmationCategory.set(null);
  }
}
