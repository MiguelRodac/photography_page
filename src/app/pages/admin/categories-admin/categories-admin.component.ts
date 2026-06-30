import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryDoc } from '../../../core/interfaces/firestore-models';
import { ICategoriesService, CategoryCreate } from '../../../core/interfaces/categories-service.interface';
import { CATEGORIES_SERVICE } from '../../../core/tokens/categories-service.token';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-categories-admin',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './categories-admin.component.html',
})
export class CategoriesAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly categoriesService = inject(CATEGORIES_SERVICE);
  private readonly toast = inject(ToastService);

  readonly categories = signal<CategoryDoc[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly showDeleteConfirm = signal(false);
  readonly itemToDelete = signal<CategoryDoc | null>(null);

  readonly form = this.fb.group({
    name: ['', [Validators.required]],
    slug: ['', [Validators.required]],
    order: [0, [Validators.required]],
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.loading.set(true);
    this.categoriesService.getAll().subscribe({
      next: (cats) => {
        this.categories.set(cats);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error loading categories');
        this.loading.set(false);
      },
    });
  }

  showAddForm(): void {
    this.editingId.set(null);
    this.form.reset({ order: 0 });
    this.showForm.set(true);
  }

  editItem(cat: CategoryDoc): void {
    this.editingId.set(cat.id);
    this.form.patchValue({
      name: cat.name,
      slug: cat.slug,
      order: cat.order,
    });
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset({ order: 0 });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    const data: CategoryCreate = {
      name: formValue.name!,
      slug: formValue.slug!,
      order: formValue.order!,
    };

    try {
      if (this.editingId()) {
        await this.categoriesService.update(this.editingId()!, data);
        this.toast.success('Category updated');
      } else {
        await this.categoriesService.create(data);
        this.toast.success('Category created');
      }
      this.cancelForm();
      this.loadCategories();
    } catch (err: any) {
      this.toast.error('Save failed: ' + (err?.message || 'Unknown error'));
    }
  }

  confirmDelete(cat: CategoryDoc): void {
    this.itemToDelete.set(cat);
    this.showDeleteConfirm.set(true);
  }

  onCancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.itemToDelete.set(null);
  }

  async onConfirmDelete(): Promise<void> {
    const cat = this.itemToDelete();
    if (!cat) return;

    try {
      await this.categoriesService.remove(cat.id);
      this.showDeleteConfirm.set(false);
      this.itemToDelete.set(null);
      this.loadCategories();
      this.toast.success('Category deleted');
    } catch (err: any) {
      this.toast.error('Delete failed: ' + (err?.message || 'Unknown error'));
    }
  }
}
