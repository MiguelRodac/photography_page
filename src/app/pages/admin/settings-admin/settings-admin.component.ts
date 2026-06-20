import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IContentService } from '../../../core/interfaces/content-service.interface';
import { CONTENT_SERVICE } from '../../../core/tokens/content-service.token';

@Component({
  selector: 'app-settings-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings-admin.component.html',
})
export class SettingsAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly contentService = inject(CONTENT_SERVICE);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    siteName: ['', [Validators.required]],
    logoUrl: [''],
    footerText: [''],
  });

  ngOnInit(): void {
    this.loadSettings();
  }

  private loadSettings(): void {
    this.loading.set(true);
    this.contentService.getSection<any>('settings').subscribe({
      next: (data) => {
        if (data) {
          this.form.patchValue(data);
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error loading settings');
        this.loading.set(false);
      },
    });
  }

  hasUnsavedChanges(): boolean {
    return this.form.dirty;
  }

  async save(): Promise<void> {
    this.saving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const data = {
      siteName: this.form.value.siteName || '',
      logoUrl: this.form.value.logoUrl || '',
      footerText: this.form.value.footerText || '',
    };

    try {
      await this.contentService.updateSection('settings', data);
      this.form.markAsPristine();
      this.successMessage.set('Settings saved successfully');
    } catch (err: any) {
      this.errorMessage.set(err?.message || 'Save failed');
    } finally {
      this.saving.set(false);
    }
  }

  clearSuccessOnEdit(): void {
    if (this.successMessage()) {
      this.successMessage.set(null);
    }
  }
}
