import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IContentService } from '../../../core/interfaces/content-service.interface';
import { CONTENT_SERVICE } from '../../../core/tokens/content-service.token';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

interface SectionConfig {
  id: string;
  label: string;
  fields: string[];
}

@Component({
  selector: 'app-content-admin',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, NgClass, ConfirmDialogComponent],
  templateUrl: './content-admin.component.html',
})
export class ContentAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly contentService = inject(CONTENT_SERVICE);

  readonly sections: SectionConfig[] = [
    { id: 'hero', label: 'Hero', fields: ['title', 'subtitle', 'cta'] },
    { id: 'aboutMe', label: 'About Me', fields: ['title', 'subtitle', 'description', 'image'] },
    { id: 'contact', label: 'Contact', fields: ['title', 'subtitle', 'address', 'email', 'phone'] },
    { id: 'socialLinks', label: 'Social Links', fields: ['links'] },
  ];

  readonly selectedSection = signal<string | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly previewMode = signal(false);
  readonly showDiscardConfirm = signal(false);
  readonly originalData = signal<any>(null);

  readonly form = this.fb.group({
    title: [''],
    subtitle: [''],
    description: [''],
    cta: [''],
    address: [''],
    email: [''],
    phone: [''],
    image: [''],
    links: [''],
  });

  ngOnInit(): void {}

  selectSection(sectionId: string): void {
    this.selectedSection.set(sectionId);
    this.previewMode.set(false);
    this.loadSection(sectionId);
  }

  private loadSection(sectionId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.contentService.getSection<any>(sectionId).subscribe({
      next: (data) => {
        if (data) {
          this.originalData.set(data);
          this.form.patchValue(data);
          if (data.links) {
            this.form.controls['links'].setValue(JSON.stringify(data.links, null, 2));
          }
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error loading section');
        this.loading.set(false);
      },
    });
  }

  togglePreview(): void {
    this.previewMode.update((v) => !v);
  }

  hasUnsavedChanges(): boolean {
    if (!this.originalData()) return false;
    return this.form.dirty;
  }

  async save(): Promise<void> {
    const sectionId = this.selectedSection();
    if (!sectionId) return;

    this.saving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const formValue = this.form.value;
    const section = this.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const data: any = {};
    for (const field of section.fields) {
      if (field === 'links') {
        try {
          data[field] = JSON.parse(formValue['links'] || '[]');
        } catch {
          this.errorMessage.set('Invalid JSON for links');
          this.saving.set(false);
          return;
        }
      } else {
        data[field] = (formValue as any)[field] || '';
      }
    }

    try {
      await this.contentService.updateSection(sectionId, data);
      this.originalData.set(data);
      this.form.markAsPristine();
      this.successMessage.set('Saved successfully');
    } catch (err: any) {
      this.errorMessage.set(err?.message || 'Save failed');
    } finally {
      this.saving.set(false);
    }
  }

  discardChanges(): void {
    if (this.hasUnsavedChanges()) {
      this.showDiscardConfirm.set(true);
    }
  }

  onConfirmDiscard(): void {
    const sectionId = this.selectedSection();
    if (sectionId) {
      this.loadSection(sectionId);
    }
    this.showDiscardConfirm.set(false);
  }

  onCancelDiscard(): void {
    this.showDiscardConfirm.set(false);
  }

  clearSuccessOnEdit(): void {
    if (this.successMessage()) {
      this.successMessage.set(null);
    }
  }

  getCurrentSection(): SectionConfig | undefined {
    return this.sections.find((s) => s.id === this.selectedSection());
  }
}
