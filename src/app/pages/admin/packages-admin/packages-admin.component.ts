import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PackageDoc } from '../../../core/interfaces/firestore-models';
import { IPackageService, PackageCreate } from '../../../core/interfaces/package-service.interface';
import { PACKAGE_SERVICE } from '../../../core/tokens/package-service.token';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-packages-admin',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './packages-admin.component.html',
})
export class PackagesAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly packageService = inject(PACKAGE_SERVICE);

  readonly packages = signal<PackageDoc[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly selectedCategory = signal('');
  readonly showToggleConfirm = signal(false);
  readonly packageToToggle = signal<PackageDoc | null>(null);

  readonly categories = computed(() => {
    const cats = new Set(this.packages().map((pkg) => pkg.category));
    return Array.from(cats).sort();
  });

  readonly filteredPackages = computed(() => {
    const cat = this.selectedCategory();
    if (!cat) return this.packages();
    return this.packages().filter((pkg) => pkg.category === cat);
  });

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    category: ['wedding' as PackageDoc['category'], [Validators.required]],
    price: [0, [Validators.required, Validators.min(1)]],
    currency: ['USD', [Validators.required]],
    features: this.fb.array<FormControl<string | null>>([]),
  });

  get features(): FormArray<FormControl<string | null>> {
    return this.form.controls['features'] as FormArray<FormControl<string | null>>;
  }

  ngOnInit(): void {
    this.loadPackages();
  }

  private loadPackages(): void {
    this.loading.set(true);
    this.packageService.getAll().subscribe({
      next: (pkgs) => {
        this.packages.set(pkgs);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error loading packages');
        this.loading.set(false);
      },
    });
  }

  showAddForm(): void {
    this.editingId.set(null);
    this.resetForm();
    this.showForm.set(true);
  }

  editPackage(pkg: PackageDoc): void {
    this.editingId.set(pkg.id);
    this.form.patchValue({
      name: pkg.name,
      category: pkg.category,
      price: pkg.price,
      currency: pkg.currency,
    });
    // Rebuild features FormArray
    this.features.clear();
    pkg.features.forEach((f) => this.features.push(this.fb.control(f)));
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.resetForm();
  }

  addFeature(): void {
    this.features.push(this.fb.control(''));
  }

  removeFeature(index: number): void {
    this.features.removeAt(index);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    const formValue = this.form.value;

    const data: PackageCreate = {
      name: formValue.name!,
      category: formValue.category as PackageDoc['category'],
      price: formValue.price!,
      currency: formValue.currency!,
      features: (formValue.features || []).filter((f): f is string => f != null && f !== ''),
      active: true,
    };

    try {
      if (this.editingId()) {
        await this.packageService.update(this.editingId()!, data);
      } else {
        await this.packageService.create(data);
      }
      this.cancelForm();
      this.loadPackages();
    } catch (err: any) {
      this.errorMessage.set(err?.message || 'Operation failed');
    }
  }

  confirmToggleActive(pkg: PackageDoc): void {
    this.packageToToggle.set(pkg);
    this.showToggleConfirm.set(true);
  }

  onCancelToggle(): void {
    this.showToggleConfirm.set(false);
    this.packageToToggle.set(null);
  }

  async onConfirmToggle(): Promise<void> {
    const pkg = this.packageToToggle();
    if (!pkg) return;

    try {
      if (pkg.active) {
        await this.packageService.deactivate(pkg.id);
      } else {
        await this.packageService.update(pkg.id, { active: true });
      }
      this.showToggleConfirm.set(false);
      this.packageToToggle.set(null);
      this.loadPackages();
    } catch (err: any) {
      this.errorMessage.set(err?.message || 'Toggle failed');
    }
  }

  private resetForm(): void {
    this.form.reset({
      category: 'wedding',
      price: 0,
      currency: 'USD',
    });
    this.features.clear();
  }
}
