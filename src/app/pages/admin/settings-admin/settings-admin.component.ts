import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IContentService } from '../../../core/interfaces/content-service.interface';
import { CONTENT_SERVICE } from '../../../core/tokens/content-service.token';
import { ThemeLoaderService } from '../../../services/theme-loader.service';
import { ThemeSettings } from '../../../core/interfaces/firestore-models';

@Component({
  selector: 'app-settings-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings-admin.component.html',
})
export class SettingsAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly contentService = inject(CONTENT_SERVICE);
  private readonly themeLoader = inject(ThemeLoaderService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly themeLoading = signal(true);
  readonly themeSaving = signal(false);
  readonly themeError = signal<string | null>(null);
  readonly themeSuccess = signal<string | null>(null);

  readonly form = this.fb.group({
    siteName: ['', [Validators.required]],
    logoUrl: [''],
    footerText: [''],
  });

  readonly themeForm = this.fb.group({
    primaryColor: ['#d4892e'],
    primaryHover: ['#bd7023'],
    displayFont: ['"Cormorant Garamond"'],
    bodyFont: ['"Inter"'],
    borderRadius: ['12'],
    darkModeDefault: [false],
  });

  readonly displayFonts = [
    { label: 'Playfair Display', value: '"Playfair Display"' },
    { label: 'Cormorant Garamond', value: '"Cormorant Garamond"' },
    { label: 'DM Serif Display', value: '"DM Serif Display"' },
    { label: 'Montserrat', value: '"Montserrat"' },
  ];

  readonly bodyFonts = [
    { label: 'Inter', value: '"Inter"' },
    { label: 'Lato', value: '"Lato"' },
    { label: 'Nunito', value: '"Nunito"' },
    { label: 'Source Sans Pro', value: '"Source Sans Pro"' },
  ];

  ngOnInit(): void {
    this.loadSettings();
    this.loadTheme();
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

  private loadTheme(): void {
    this.themeLoading.set(true);
    this.contentService.getSection<ThemeSettings>('theme').subscribe({
      next: (data) => {
        if (data) {
          this.themeForm.patchValue({
            primaryColor: data.primaryColor || '#d4892e',
            primaryHover: data.primaryHover || '#bd7023',
            displayFont: data.displayFont || '"Cormorant Garamond"',
            bodyFont: data.bodyFont || '"Inter"',
            borderRadius: String(parseInt(data.borderRadius) || 12),
            darkModeDefault: data.darkModeDefault ?? false,
          });
        }
        this.themeLoading.set(false);
      },
      error: () => {
        this.themeError.set('Error loading theme');
        this.themeLoading.set(false);
      },
    });
  }

  hasUnsavedChanges(): boolean {
    return this.form.dirty;
  }

  hasThemeUnsavedChanges(): boolean {
    return this.themeForm.dirty;
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

  async saveTheme(): Promise<void> {
    this.themeSaving.set(true);
    this.themeError.set(null);
    this.themeSuccess.set(null);

    const radius = this.themeForm.value.borderRadius || '12';
    const data: ThemeSettings = {
      primaryColor: this.themeForm.value.primaryColor || '#d4892e',
      primaryHover: this.themeForm.value.primaryHover || '#bd7023',
      displayFont: this.themeForm.value.displayFont || '"Cormorant Garamond"',
      bodyFont: this.themeForm.value.bodyFont || '"Inter"',
      borderRadius: `${radius}px`,
      darkModeDefault: this.themeForm.value.darkModeDefault ?? false,
    };

    try {
      await this.contentService.updateSection('theme', data);
      this.themeLoader.applyTheme(data);
      this.themeLoader.theme.set(data);
      this.themeForm.markAsPristine();
      this.themeSuccess.set('Theme saved and applied');
    } catch (err: any) {
      this.themeError.set(err?.message || 'Theme save failed');
    } finally {
      this.themeSaving.set(false);
    }
  }

  clearSuccessOnEdit(): void {
    if (this.successMessage()) {
      this.successMessage.set(null);
    }
  }

  clearThemeSuccessOnEdit(): void {
    if (this.themeSuccess()) {
      this.themeSuccess.set(null);
    }
  }

  previewFontFamily(fontValue: string): string {
    return fontValue.replace(/"/g, '');
  }
}
