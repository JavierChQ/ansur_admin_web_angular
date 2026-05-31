import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../../services/categories.service';
import { ProductsService } from '../../../services/products.service';
import { Category } from '../../../../models/category.model';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
})
export class ProductEditComponent {
  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl(''),
    price: new FormControl<number | null>(null, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    id_category: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected readonly categories = signal<Category[]>([]);
  protected readonly isSaving = signal(false);
  protected readonly error = signal('');
  protected readonly existingImages = signal<string[]>([]);
  protected readonly replacements = signal<Record<number, File | null>>({});
  protected readonly previews = signal<Record<number, string | null>>({});

  private readonly id = signal<string | null>(null);
  protected readonly isNew = computed(() => !this.id());

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
    private readonly router: Router
  ) {
    this.loadCategories();

    this.activatedRoute.paramMap.subscribe((params) => {
      const productId = params.get('id');
      this.id.set(productId);

      if (!productId) {
        this.existingImages.set([]);
        this.form.reset({
          name: '',
          description: '',
          price: null,
          id_category: this.categories()[0]?.id ?? '',
        });
        return;
      }

      this.productsService.getProductById(productId).subscribe({
        next: (product) => this.setProductValues(product),
        error: () => this.error.set('No se pudo cargar el producto.'),
      });
    });
  }

  private loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        if (!this.id() && data.length) {
          this.form.controls.id_category.setValue(data[0].id);
        }
      },
      error: () => {
        this.error.set('No se pudieron cargar las categorías.');
      },
    });
  }

  private setProductValues(product: Product): void {
    const existingImages = [product.image1, product.image2].filter(Boolean) as string[];
    this.existingImages.set(existingImages);

    this.form.setValue({
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      id_category: product.id_category,
    });
  }

  protected showConfirm = signal(false);

  private performSave(): void {
    this.isSaving.set(true);
    this.error.set('');
    const name = this.form.controls.name.value;
    const description = this.form.controls.description.value ?? '';
    const priceVal = this.form.controls.price.value;
    const priceNumber = priceVal === null ? null : Number(priceVal);
    const idCategory = this.form.controls.id_category.value;

    const replacements = this.replacements();
    const hasReplacements = Object.keys(replacements).length > 0;

    let request$;

    if (this.isNew()) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', String(priceNumber));
      formData.append('id_category', idCategory);

      // Append any selected images for new product
      for (const key of Object.keys(replacements)) {
        const idx = Number(key);
        const file = replacements[idx];
        if (file) {
          formData.append('files[]', file);
          formData.append('images_to_update', String(idx));
        }
      }

      request$ = this.productsService.createProduct(formData);
    } else {
      if (hasReplacements) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', String(priceNumber));
        formData.append('id_category', idCategory);

        // Append replacement files with their target indices
        for (const key of Object.keys(replacements)) {
          const idx = Number(key);
          const file = replacements[idx];
          if (file) {
            formData.append('files[]', file);
            formData.append('images_to_update', String(idx));
          }
        }

        request$ = this.productsService.updateProductWithImage(this.id()!, formData);
      } else {
        const payload: Record<string, unknown> = {
          name,
          description,
          price: priceNumber,
          id_category: idCategory,
        };

        request$ = this.productsService.updateProduct(this.id()!, payload);
      }
    }

    request$.subscribe({
      next: () => this.router.navigate(['/admin/products']),
      error: (error) => {
        console.error('Error guardando producto', error);
        const serverMessage =
          (error?.error as { message?: string })?.message ||
          error?.statusText ||
          'No se pudo guardar el producto.';
        this.error.set(`No se pudo guardar el producto: ${serverMessage}`);
        this.isSaving.set(false);
      },
    });
  }

  protected saveProduct(): void {
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

  protected onReplaceFile(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0) ?? null;
    const current = { ...this.replacements() };
    if (file) {
      current[index] = file;
    } else {
      delete current[index];
    }
    this.replacements.set(current);
    // manage previews
    const currentPreviews = { ...this.previews() };
    const prevUrl = currentPreviews[index];
    if (prevUrl) {
      URL.revokeObjectURL(prevUrl);
    }
    if (file) {
      currentPreviews[index] = URL.createObjectURL(file);
    } else {
      delete currentPreviews[index];
    }
    this.previews.set(currentPreviews);
  }

  protected cancel(): void {
    this.router.navigate(['/admin/products']);
  }
}
