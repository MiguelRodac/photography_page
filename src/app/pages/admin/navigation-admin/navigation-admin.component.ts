import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavLinkDoc } from '../../../core/interfaces/firestore-models';
import { INavigationService, NavLinkCreate } from '../../../core/interfaces/navigation-service.interface';
import { NAVIGATION_SERVICE } from '../../../core/tokens/navigation-service.token';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-navigation-admin',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './navigation-admin.component.html',
})
export class NavigationAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly navigationService = inject(NAVIGATION_SERVICE);

  readonly links = signal<NavLinkDoc[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly showDeleteConfirm = signal(false);
  readonly itemToDelete = signal<NavLinkDoc | null>(null);

  readonly form = this.fb.group({
    label: ['', [Validators.required]],
    path: ['', [Validators.required]],
    order: [0, [Validators.required]],
    visible: [true],
  });

  ngOnInit(): void {
    this.loadLinks();
  }

  private loadLinks(): void {
    this.loading.set(true);
    this.navigationService.getAll().subscribe({
      next: (links) => {
        this.links.set(links);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error loading navigation links');
        this.loading.set(false);
      },
    });
  }

  showAddForm(): void {
    this.editingId.set(null);
    this.form.reset({ order: 0, visible: true });
    this.showForm.set(true);
  }

  editItem(link: NavLinkDoc): void {
    this.editingId.set(link.id);
    this.form.patchValue({
      label: link.label,
      path: link.path,
      order: link.order,
      visible: link.visible,
    });
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset({ order: 0, visible: true });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    const formValue = this.form.value;

    const data: NavLinkCreate = {
      label: formValue.label!,
      path: formValue.path!,
      order: formValue.order!,
      visible: formValue.visible ?? true,
    };

    try {
      if (this.editingId()) {
        await this.navigationService.update(this.editingId()!, data);
      } else {
        await this.navigationService.create(data);
      }
      this.cancelForm();
      this.loadLinks();
    } catch (err: any) {
      this.errorMessage.set(err?.message || 'Operation failed');
    }
  }

  async toggleVisibility(link: NavLinkDoc): Promise<void> {
    try {
      await this.navigationService.update(link.id, { visible: !link.visible });
      this.loadLinks();
    } catch (err: any) {
      this.errorMessage.set(err?.message || 'Update failed');
    }
  }

  confirmDelete(link: NavLinkDoc): void {
    this.itemToDelete.set(link);
    this.showDeleteConfirm.set(true);
  }

  onCancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.itemToDelete.set(null);
  }

  async onConfirmDelete(): Promise<void> {
    const link = this.itemToDelete();
    if (!link) return;

    try {
      await this.navigationService.remove(link.id);
      this.showDeleteConfirm.set(false);
      this.itemToDelete.set(null);
      this.loadLinks();
    } catch (err: any) {
      this.errorMessage.set(err?.message || 'Delete failed');
    }
  }
}
