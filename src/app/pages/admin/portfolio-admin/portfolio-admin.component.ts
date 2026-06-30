import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioDoc } from '../../../core/interfaces/firestore-models';
import { IPortfolioService, PortfolioCreate } from '../../../core/interfaces/portfolio-service.interface';
import { PORTFOLIO_SERVICE } from '../../../core/tokens/portfolio-service.token';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../../services/toast.service';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-portfolio-admin',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './portfolio-admin.component.html',
})
export class PortfolioAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly portfolioService = inject(PORTFOLIO_SERVICE);
  private readonly toast = inject(ToastService);
  readonly i18n = inject(I18nService);

  readonly items = signal<PortfolioDoc[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly selectedCategory = signal('');
  readonly showDeleteConfirm = signal(false);
  readonly itemToDelete = signal<PortfolioDoc | null>(null);
  readonly selectedFile = signal<File | null>(null);
  readonly uploadProgress = signal(0);
  readonly uploading = signal(false);

  readonly categories = computed(() => {
    const cats = new Set(this.items().map((item) => item.category));
    return Array.from(cats).sort();
  });

  readonly filteredItems = computed(() => {
    const cat = this.selectedCategory();
    if (!cat) return this.items();
    return this.items().filter((item) => item.category === cat);
  });

  countByCategory(cat: string): number {
    return this.items().filter((item) => item.category === cat).length;
  }

  readonly form = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
    img: ['', [Validators.required]],
    imageSource: ['url' as 'upload' | 'url', [Validators.required]],
    link: [''],
    showLink: [false],
  });

  ngOnInit(): void {
    this.loadItems();
  }

  private loadItems(): void {
    this.loading.set(true);
    this.portfolioService.getAll().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error loading portfolio items');
        this.loading.set(false);
      },
    });
  }

  showAddForm(): void {
    this.editingId.set(null);
    this.form.reset({ imageSource: 'url' });
    this.showForm.set(true);
  }

  editItem(item: PortfolioDoc): void {
    this.editingId.set(item.id);
    this.form.patchValue({
      title: item.title,
      description: item.description,
      category: item.category,
      img: item.img,
      imageSource: item.imageSource,
      link: item.link || '',
      showLink: item.showLink || false,
    });
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset({ imageSource: 'url' });
    this.selectedFile.set(null);
    this.uploadProgress.set(0);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    const data: PortfolioCreate = {
      title: formValue.title!,
      description: formValue.description!,
      category: formValue.category!,
      img: formValue.img!,
      imageSource: formValue.imageSource as 'upload' | 'url',
      link: formValue.link || undefined,
      showLink: formValue.showLink || false,
    };

    try {
      if (this.editingId()) {
        await this.portfolioService.update(this.editingId()!, data);
        this.toast.success('Item updated');
      } else {
        await this.portfolioService.create(data);
        this.toast.success('Item created');
      }
      this.cancelForm();
      this.loadItems();
    } catch (err: any) {
      this.toast.error('Save failed: ' + (err?.message || 'Unknown error'));
    }
  }

  confirmDelete(item: PortfolioDoc): void {
    this.itemToDelete.set(item);
    this.showDeleteConfirm.set(true);
  }

  onCancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.itemToDelete.set(null);
  }

  async onConfirmDelete(): Promise<void> {
    const item = this.itemToDelete();
    if (!item) return;

    try {
      await this.portfolioService.softDelete(item.id);
      this.showDeleteConfirm.set(false);
      this.itemToDelete.set(null);
      this.loadItems();
      this.toast.success('Item deleted');
    } catch (err: any) {
      this.toast.error('Delete failed: ' + (err?.message || 'Unknown error'));
    }
  }

  onFileSelected(file: File | null): void {
    this.selectedFile.set(file);
    if (file) {
      this.form.controls['imageSource'].setValue('upload');
    }
  }

  async uploadImage(): Promise<void> {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);
    this.uploadProgress.set(0);

    try {
      const url = await this.portfolioService.uploadImage(file, (pct) => {
        this.uploadProgress.set(pct);
      });
      this.form.controls['img'].setValue(url);
      this.toast.success('Image uploaded');
    } catch (err: any) {
      this.toast.error('Upload failed: ' + (err?.message || 'Unknown error'));
    } finally {
      this.uploading.set(false);
    }
  }
}
