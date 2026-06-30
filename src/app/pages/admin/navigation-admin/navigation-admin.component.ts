import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavLinkDoc } from '../../../core/interfaces/firestore-models';
import { INavigationService, NavLinkCreate } from '../../../core/interfaces/navigation-service.interface';
import { NAVIGATION_SERVICE } from '../../../core/tokens/navigation-service.token';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../../services/toast.service';
import { I18nService } from '../../../services/i18n.service';

interface RouteOption {
  path: string;
  label: string;
  description: string;
}

const AVAILABLE_ROUTES: RouteOption[] = [
  { path: '/', label: 'Home', description: 'Landing page with hero, services, and portfolio preview' },
  { path: '/portfolio', label: 'Portfolio', description: 'Photo gallery with category filters and lightbox' },
  { path: '/about-me', label: 'About Me', description: 'Photographer bio, philosophy, and services overview' },
  { path: '/contact', label: 'Contact', description: 'Contact form and location information' },
];

@Component({
  selector: 'app-navigation-admin',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './navigation-admin.component.html',
})
export class NavigationAdminComponent implements OnInit {
  readonly ALL_ROUTES = AVAILABLE_ROUTES;
  private readonly fb = inject(FormBuilder);
  private readonly navigationService = inject(NAVIGATION_SERVICE);
  private readonly toast = inject(ToastService);
  readonly i18n = inject(I18nService);

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

  // Used paths (excluding current editing item)
  readonly usedPaths = computed(() =>
    this.links()
      .filter((l) => l.id !== this.editingId())
      .map((l) => l.path),
  );

  // Can't add more links than available routes
  readonly canAddMore = computed(() => this.links().length < AVAILABLE_ROUTES.length);

  // Description for selected path
  readonly selectedRouteDescription = computed(() => {
    const path = this.form.controls.path.value;
    return AVAILABLE_ROUTES.find((r) => r.path === path)?.description || '';
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
    if (!this.canAddMore()) return;
    this.editingId.set(null);
    this.form.reset({ order: this.links().length, visible: true });
    // Pre-select first unused route
    const usedSet = new Set(this.usedPaths());
    const firstFree = this.ALL_ROUTES.find((r) => !usedSet.has(r.path));
    if (firstFree) this.form.patchValue({ path: firstFree.path, label: firstFree.label });
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
  }

  onPathChange(path: string): void {
    const route = AVAILABLE_ROUTES.find((r) => r.path === path);
    if (route && !this.editingId()) {
      this.form.patchValue({ label: route.label });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

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
        this.toast.success('Link updated');
      } else {
        await this.navigationService.create(data);
        this.toast.success('Link created');
      }
      this.cancelForm();
      this.loadLinks();
    } catch (err: any) {
      this.toast.error('Save failed: ' + (err?.message || 'Unknown error'));
    }
  }

  async toggleVisibility(link: NavLinkDoc): Promise<void> {
    try {
      await this.navigationService.update(link.id, { visible: !link.visible });
      this.loadLinks();
    } catch (err: any) {
      this.toast.error('Update failed: ' + (err?.message || 'Unknown error'));
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
      this.toast.success('Link deleted');
    } catch (err: any) {
      this.toast.error('Delete failed: ' + (err?.message || 'Unknown error'));
    }
  }
}
