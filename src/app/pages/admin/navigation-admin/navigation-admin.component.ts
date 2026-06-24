import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavLinkDoc } from '../../../core/interfaces/firestore-models';
import { INavigationService, NavLinkCreate } from '../../../core/interfaces/navigation-service.interface';
import { NAVIGATION_SERVICE } from '../../../core/tokens/navigation-service.token';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

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

  // Used paths (excluding the one being edited)
  readonly usedPaths = computed(() => {
    const editingPath = this.form.controls.path.value;
    return this.links()
      .filter((l) => l.id !== this.editingId())
      .map((l) => l.path);
  });

  // Routes not yet used (plus the one being edited)
  readonly availableRoutes = computed(() =>
    AVAILABLE_ROUTES.filter(
      (r) => !this.usedPaths().includes(r.path) || r.path === this.editingPath(),
    ),
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
    // Pre-select first available route
    const firstAvailable = this.availableRoutes()[0];
    if (firstAvailable) this.form.patchValue({ path: firstAvailable.path, label: firstAvailable.label });
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
