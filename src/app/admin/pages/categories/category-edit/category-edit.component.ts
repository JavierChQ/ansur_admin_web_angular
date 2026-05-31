import { CommonModule } from '@angular/common';
import { Component, computed, signal, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../../services/categories.service';
import { Category } from '../../../../models/category.model';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css'],
})
export class CategoryEditComponent {
  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    description: new FormControl(''),
    image: new FormControl<File | null>(null),
  });

  protected readonly isSaving = signal(false);
  protected readonly error = signal('');
  protected readonly existingImage = signal<string | null>(null);
  protected readonly preview = signal<string | null>(null);
  protected readonly showConfirm = signal(false);

  private readonly id = signal<string | null>(null);

  protected readonly isNew = computed(() => !this.id());

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly categoriesService: CategoriesService,
    private readonly router: Router
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      const categoryId = params.get('id');
      this.id.set(categoryId);

      if (!categoryId) {
        this.existingImage.set(null);
        this.form.reset({ name: '', description: '', image: null });
        return;
      }

      console.log('CategoryEdit: loading id=', categoryId);
      this.categoriesService.getCategoryById(categoryId).subscribe({
        next: (category) => {
          console.log('CategoryEdit: loaded category=', category);
          this.existingImage.set(category.image ?? null);
          this.form.patchValue({
            name: category.name ?? '',
            description: category.description ?? '',
            image: null,
          });
        },
        error: (err) => {
          console.error('CategoryEdit: error loading category', err);
          const status = (err && err.status) ? `(${err.status}) ` : '';
          const serverMsg = (err && err.error && (err.error.message || err.error)) ? ` - ${JSON.stringify(err.error)}` : '';
          this.error.set(`No se pudo cargar la categoría. ${status}${serverMsg}`);

          // Fallback: try to load categories list and find the item by id
          this.categoriesService.getCategories().subscribe({
            next: (items) => {
              const found = items.find((c) => String(c.id) === String(categoryId));
              if (found) {
                console.warn('CategoryEdit: filled from categories list fallback', found);
                this.existingImage.set(found.image ?? null);
                this.form.patchValue({
                  name: found.name ?? '',
                  description: found.description ?? '',
                  image: null,
                });
                // clear previous error message
                this.error.set('');
              }
            },
            error: (e) => {
              console.error('CategoryEdit: fallback getCategories failed', e);
            },
          });
        },
      });
    });
  }

  private performSave(): void {
    this.isSaving.set(true);
    this.error.set('');

    const formData = new FormData();
    formData.append('name', this.form.controls.name.value);
    formData.append('description', this.form.controls.description.value ?? '');

    const imageFile = this.form.controls.image.value;
    if (imageFile instanceof File) {
      formData.append('file', imageFile);
    }

    const request = this.isNew()
      ? this.categoriesService.createCategory(formData)
      : imageFile instanceof File
      ? this.categoriesService.updateCategoryWithImage(this.id()!, formData)
      : this.categoriesService.updateCategory(this.id()!, formData);

    request.subscribe({
      next: () => this.router.navigate(['/admin/categories']),
      error: (error) => {
        console.error('Error guardando categoría', error);
        const serverMessage =
          (error?.error as { message?: string })?.message ||
          error?.statusText ||
          'No se pudo guardar la categoría.';
        this.error.set(`No se pudo guardar la categoría: ${serverMessage}`);
        this.isSaving.set(false);
      },
    });
  }

  protected saveCategory(): void {
    if (this.form.invalid) {
      this.error.set('Completa todos los campos requeridos.');
      return;
    }

    this.showConfirm.set(true);
  }

  protected confirmCancel(): void {
    this.showConfirm.set(false);
  }

  protected confirmAccept(): void {
    this.showConfirm.set(false);
    this.performSave();
  }

  protected updateFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.form.controls.image.setValue(file);

    const prev = this.preview();
    if (prev) {
      try {
        URL.revokeObjectURL(prev);
      } catch (e) {
        // ignore
      }
    }

    if (file) {
      this.preview.set(URL.createObjectURL(file));
    } else {
      this.preview.set(null);
    }
  }

  ngOnDestroy(): void {
    const prev = this.preview();
    if (prev) {
      try {
        URL.revokeObjectURL(prev);
      } catch (e) {
        // ignore
      }
    }
  }

  protected cancel(): void {
    this.router.navigate(['/admin/categories']);
  }
}
