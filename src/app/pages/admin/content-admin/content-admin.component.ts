import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IContentService } from '../../../core/interfaces/content-service.interface';
import { CONTENT_SERVICE } from '../../../core/tokens/content-service.token';

interface SectionConfig {
  id: string;
  label: string;
  icon: string;
  fields: string[];
}

@Component({
  selector: 'app-content-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './content-admin.component.html',
})
export class ContentAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly contentService = inject(CONTENT_SERVICE);

  readonly sections: SectionConfig[] = [
    { id: 'hero', label: 'Home Hero', icon: 'bolt', fields: ['title', 'subtitle', 'cta', 'bgImage'] },
    { id: 'services', label: 'Home Services', icon: 'briefcase', fields: ['services'] },
    { id: 'about', label: 'About Me', icon: 'user', fields: ['title', 'description', 'image', 'stats'] },
    { id: 'contact', label: 'Contact', icon: 'envelope', fields: ['title', 'description', 'email', 'phone', 'address', 'mapEmbed'] },
    { id: 'header', label: 'Header', icon: 'bars', fields: ['siteName', 'logoUrl'] },
    { id: 'footer', label: 'Footer', icon: 'document', fields: ['copyrightText'] },
    { id: 'whatsapp', label: 'WhatsApp', icon: 'chat', fields: ['phoneNumber', 'defaultMessage'] },
  ];

  readonly expandedSections = signal<Set<string>>(new Set());
  readonly loadingSections = signal<Set<string>>(new Set());
  readonly savingSection = signal<string | null>(null);
  readonly successSections = signal<Set<string>>(new Set());
  readonly errorSections = signal<Map<string, string>>(new Map());
  readonly sectionData = signal<Map<string, any>>(new Map());
  readonly footerLinks = signal<{ platform: string; url: string }[]>([]);

  readonly sectionForms = new Map<string, ReturnType<typeof this.fb.group>>();

  ngOnInit(): void {
    for (const section of this.sections) {
      this.sectionForms.set(section.id, this.buildForm(section.fields));
    }
  }

  private buildForm(fields: string[]): ReturnType<typeof this.fb.group> {
    const controls: Record<string, any> = {};
    for (const field of fields) {
      controls[field] = [''];
    }
    return this.fb.group(controls);
  }

  toggleSection(sectionId: string): void {
    const expanded = new Set(this.expandedSections());
    if (expanded.has(sectionId)) {
      expanded.delete(sectionId);
    } else {
      expanded.add(sectionId);
      this.loadSection(sectionId);
    }
    this.expandedSections.set(expanded);
  }

  isExpanded(sectionId: string): boolean {
    return this.expandedSections().has(sectionId);
  }

  isLoading(sectionId: string): boolean {
    return this.loadingSections().has(sectionId);
  }

  isSuccess(sectionId: string): boolean {
    return this.successSections().has(sectionId);
  }

  getSectionError(sectionId: string): string | null {
    return this.errorSections().get(sectionId) || null;
  }

  getForm(sectionId: string) {
    return this.sectionForms.get(sectionId);
  }

  private loadSection(sectionId: string): void {
    const loading = new Set(this.loadingSections());
    loading.add(sectionId);
    this.loadingSections.set(loading);

    this.contentService.getSection<any>(sectionId).subscribe({
      next: (data) => {
        if (data) {
          const form = this.getForm(sectionId);
          if (form) {
            const patchData: any = {};
            for (const key of Object.keys(data)) {
              if (key === 'socialLinks' && sectionId === 'footer') {
                this.footerLinks.set(Array.isArray(data[key]) ? data[key] : []);
                continue;
              }
              if (form.controls[key]) {
                if (typeof data[key] === 'object' && data[key] !== null) {
                  patchData[key] = JSON.stringify(data[key], null, 2);
                } else {
                  patchData[key] = data[key];
                }
              }
            }
            form.patchValue(patchData);
            form.markAsPristine();
          }
          const dataMap = new Map(this.sectionData());
          dataMap.set(sectionId, data);
          this.sectionData.set(dataMap);
        }
        const loadingDone = new Set(this.loadingSections());
        loadingDone.delete(sectionId);
        this.loadingSections.set(loadingDone);
      },
      error: () => {
        const errors = new Map(this.errorSections());
        errors.set(sectionId, 'Error loading section');
        this.errorSections.set(errors);
        const loadingDone = new Set(this.loadingSections());
        loadingDone.delete(sectionId);
        this.loadingSections.set(loadingDone);
      },
    });
  }

  async saveSection(sectionId: string): Promise<void> {
    const form = this.getForm(sectionId);
    if (!form) return;

    this.savingSection.set(sectionId);
    const errors = new Map(this.errorSections());
    errors.delete(sectionId);
    this.errorSections.set(errors);

    const section = this.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const data: any = {};
    for (const field of section.fields) {
      const val = form.controls[field]?.value;
      if (val !== null && val !== undefined && val !== '') {
        if (field === 'services' || field === 'stats') {
          try {
            data[field] = JSON.parse(val);
          } catch {
            const errs = new Map(this.errorSections());
            errs.set(sectionId, `Invalid JSON for ${field}`);
            this.errorSections.set(errs);
            this.savingSection.set(null);
            return;
          }
        } else {
          data[field] = val;
        }
      }
    }

    // Add social links for footer
    if (sectionId === 'footer') {
      data['socialLinks'] = this.footerLinks().filter((l) => l.platform && l.url);
    }

    try {
      await this.contentService.updateSection(sectionId, data);
      form.markAsPristine();
      const success = new Set(this.successSections());
      success.add(sectionId);
      this.successSections.set(success);
      setTimeout(() => {
        const s = new Set(this.successSections());
        s.delete(sectionId);
        this.successSections.set(s);
      }, 3000);
    } catch (err: any) {
      const errs = new Map(this.errorSections());
      errs.set(sectionId, err?.message || 'Save failed');
      this.errorSections.set(errs);
    } finally {
      this.savingSection.set(null);
    }
  }

  clearSuccessOnEdit(sectionId: string): void {
    const success = new Set(this.successSections());
    if (success.has(sectionId)) {
      success.delete(sectionId);
      this.successSections.set(success);
    }
  }

  isDirty(sectionId: string): boolean {
    const form = this.getForm(sectionId);
    return form?.dirty ?? false;
  }

  formatFieldName(field: string): string {
    return field.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
  }

  isJsonField(field: string): boolean {
    return ['services', 'stats'].includes(field);
  }

  isLongTextField(field: string): boolean {
    return ['description', 'defaultMessage'].includes(field);
  }

  getInputType(field: string): string {
    if (field.includes('Url') || field === 'image' || field === 'bgImage' || field === 'logoUrl' || field === 'mapEmbed') return 'url';
    if (field === 'email') return 'email';
    if (field === 'phone' || field === 'phoneNumber') return 'tel';
    return 'text';
  }

  getJsonPlaceholder(field: string): string {
    if (field === 'services') return '[{"id": "wedding", "title": "Weddings", "description": "..."}]';
    if (field === 'stats') return '[{"value": "500+", "label": "Sessions"}]';
    return '[]';
  }

  // --- Footer social links repeater ---

  addFooterLink(): void {
    this.footerLinks.update((links) => [...links, { platform: '', url: '' }]);
  }

  removeFooterLink(index: number): void {
    this.footerLinks.update((links) => links.filter((_, i) => i !== index));
  }

  updateFooterLink(index: number, key: 'platform' | 'url', value: string): void {
    this.footerLinks.update((links) =>
      links.map((link, i) => (i === index ? { ...link, [key]: value } : link)),
    );
    this.clearSuccessOnEdit('footer');
  }
}
