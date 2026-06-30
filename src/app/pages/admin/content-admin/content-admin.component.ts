import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { IContentService } from '../../../core/interfaces/content-service.interface';
import { CONTENT_SERVICE } from '../../../core/tokens/content-service.token';
import { PageSectionItem, PageSectionsConfig } from '../../../core/interfaces/firestore-models';
import { ToastService } from '../../../services/toast.service';

interface SectionConfig {
  id: string;
  label: string;
  icon: string;
  fields: string[];
}

interface RouteOption {
  value: string;
  label: string;
}

const AVAILABLE_ROUTES: RouteOption[] = [
  { value: '/', label: 'Home' },
  { value: '/portfolio', label: 'Portfolio' },
  { value: '/about-me', label: 'About Me' },
  { value: '/contact', label: 'Contact' },
];

const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: 'mdi:instagram' },
  { id: 'facebook', name: 'Facebook', icon: 'mdi:facebook' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'mdi:whatsapp' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'mdi:linkedin' },
  { id: 'github', name: 'GitHub', icon: 'mdi:github' },
  { id: 'tiktok', name: 'TikTok', icon: 'ic:baseline-tiktok' },
  { id: 'snapchat', name: 'Snapchat', icon: 'mdi:snapchat' },
  { id: 'telegram', name: 'Telegram', icon: 'mdi:telegram' },
  { id: 'youtube', name: 'YouTube', icon: 'mdi:youtube' },
  { id: 'x', name: 'X / Twitter', icon: 'ri:twitter-x-fill' },
  { id: 'pinterest', name: 'Pinterest', icon: 'mdi:pinterest' },
  { id: 'discord', name: 'Discord', icon: 'mdi:discord' },
  { id: 'email', name: 'Email', icon: 'mdi:email-outline' },
];

@Component({
  selector: 'app-content-admin',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './content-admin.component.html',
})
export class ContentAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly contentService = inject(CONTENT_SERVICE);
  private readonly toast = inject(ToastService);

  readonly sections: SectionConfig[] = [
    { id: 'hero', label: 'Home Hero', icon: 'bolt', fields: ['title', 'subtitle', 'cta', 'ctaRoute', 'bgImage'] },
    { id: 'services', label: 'Home Services', icon: 'briefcase', fields: ['sectionTitle', 'sectionDescription'] },
    { id: 'testimonials', label: 'Testimonials', icon: 'star', fields: ['sectionTitle', 'sectionDescription'] },
    { id: 'portfolio-preview', label: 'Portfolio Preview', icon: 'image', fields: ['sectionTitle', 'sectionDescription', 'ctaText', 'ctaRoute'] },
    { id: 'cta', label: 'Call to Action', icon: 'megaphone', fields: ['title', 'description', 'buttonText', 'ctaRoute'] },
    { id: 'about', label: 'About Me', icon: 'user', fields: ['heroLabel', 'title', 'subtitle', 'description', 'extra', 'profileImageAlt', 'overlayImage', 'overlayImageAlt', 'philosophyLabel', 'quote', 'philosophy', 'servicesLabel', 'servicesTitle', 'image', 'ctaRoute'] },
    { id: 'contact', label: 'Contact', icon: 'envelope', fields: ['heroLabel', 'heroTitle', 'heroTitleAccent', 'heroSubtitle', 'bgImage', 'formTitle', 'formSubtitle', 'serviceTypeLabel', 'serviceTypeError', 'serviceTypes', 'email', 'phone', 'address', 'mapEmbed', 'infoEmailLabel', 'infoLocationLabel', 'infoResponseLabel', 'infoResponseValue', 'whatsappTitle', 'whatsappSubtitle', 'statsValue', 'statsLabel'] },
    { id: 'header', label: 'Header', icon: 'bars', fields: ['siteName', 'logoUrl'] },
    { id: 'footer', label: 'Footer', icon: 'document', fields: ['copyrightText', 'tagline', 'showLinks', 'socialTitle', 'showSocialLinks'] },
    { id: 'portfolio', label: 'Portfolio Page', icon: 'image', fields: ['pageTitle', 'pageSubtitle', 'emptyMessage'] },
    { id: 'whatsapp', label: 'WhatsApp', icon: 'chat', fields: ['phoneNumber', 'defaultMessage', 'buttonTooltip', 'buttonAriaLabel'] },
  ];

  readonly heroLayouts = [
    { value: 'parallax', label: 'Parallax (full-screen bg)' },
    { value: 'gradient', label: 'Gradient overlay' },
    { value: 'split', label: 'Split (image left, text right)' },
    { value: 'minimal', label: 'Minimal (text only)' },
  ];

  readonly servicesLayouts = [
    { value: 'grid-4', label: '4-column grid' },
    { value: 'grid-3', label: '3-column grid' },
    { value: 'list', label: 'Vertical list' },
  ];

  readonly sectionLayouts = signal<Map<string, string>>(new Map([
    ['hero', 'parallax'],
    ['services', 'grid-4'],
  ]));

  /** @deprecated Accordion state — kept for backward compat, sidebar uses activeSection */
  readonly expandedSections = signal<Set<string>>(new Set());
  readonly loadingSections = signal<Set<string>>(new Set());
  readonly savingSection = signal<string | null>(null);
  readonly successSections = signal<Set<string>>(new Set());
  readonly errorSections = signal<Map<string, string>>(new Map());
  readonly sectionData = signal<Map<string, any>>(new Map());

  // Sidebar navigation
  readonly activeSection = signal<string>('hero');
  readonly loadedSections = signal<Set<string>>(new Set());
  readonly activeView = signal<'section' | 'page-sections'>('section');
  readonly footerLinks = signal<{ platform: string; url: string; icon?: string; enabled?: boolean }[]>([]);
  readonly showCustomSocialModal = signal(false);
  readonly customSocialName = signal('');
  readonly customSocialUrl = signal('');
  readonly servicesItems = signal<{ id: string; title: string; description: string; icon: string }[]>([]);

  readonly aboutStats = signal<{ value: string; label: string }[]>([]);
  readonly testimonialsItems = signal<{ name: string; role: string; text: string }[]>([]);
  readonly contactFormFields = signal<{
    name: string;
    type: string;
    label: string;
    placeholder: string;
    required: boolean;
    validators: { type: string; value?: string | number; message: string }[];
  }[]>([]);

  // Section visibility/ordering
  readonly homeSections = signal<PageSectionItem[]>([
    { id: 'hero', visible: true, order: 1 },
    { id: 'services', visible: true, order: 2 },
    { id: 'portfolio-preview', visible: true, order: 3 },
    { id: 'testimonials', visible: true, order: 4 },
    { id: 'cta', visible: true, order: 5 },
  ]);
  readonly aboutSections = signal<PageSectionItem[]>([
    { id: 'hero', visible: true, order: 1 },
    { id: 'philosophy', visible: true, order: 2 },
    { id: 'services', visible: true, order: 3 },
    { id: 'cta', visible: true, order: 4 },
  ]);
  readonly sectionsConfigLoading = signal(false);
  readonly sectionsConfigSaving = signal<string | null>(null);
  readonly sectionsConfigSuccess = signal<string | null>(null);

  readonly sectionForms = new Map<string, ReturnType<typeof this.fb.group>>();

  ngOnInit(): void {
    for (const section of this.sections) {
      this.sectionForms.set(section.id, this.buildForm(section.fields));
    }
    this.loadSectionsConfig();
    // Load the initially active section
    this.selectSection('hero');
  }

  // --- Sidebar navigation ---

  selectSection(sectionId: string): void {
    this.activeSection.set(sectionId);
    this.activeView.set('section');
    if (!this.loadedSections().has(sectionId)) {
      this.loadSection(sectionId);
      const loaded = new Set(this.loadedSections());
      loaded.add(sectionId);
      this.loadedSections.set(loaded);
    }
  }

  selectPageSections(): void {
    this.activeView.set('page-sections');
  }

  isActiveSection(sectionId: string): boolean {
    return this.activeSection() === sectionId && this.activeView() === 'section';
  }

  isActivePageSections(): boolean {
    return this.activeView() === 'page-sections';
  }

  isSectionDirty(sectionId: string): boolean {
    return this.isDirty(sectionId);
  }

  isSectionSuccess(sectionId: string): boolean {
    return this.isSuccess(sectionId);
  }

  /** @deprecated Accordion toggle — sidebar uses selectSection instead */
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

  /** @deprecated Use isActiveSection() instead */
  isExpanded(sectionId: string): boolean {
    return this.expandedSections().has(sectionId);
  }

  isLoading(sectionId: string): boolean {
    return this.loadingSections().has(sectionId);
  }

  private buildForm(fields: string[]): ReturnType<typeof this.fb.group> {
    const controls: Record<string, any> = {};
    for (const field of fields) {
      controls[field] = [''];
    }
    return this.fb.group(controls);
  }

  // --- Section visibility/ordering ---

  private loadSectionsConfig(): void {
    this.sectionsConfigLoading.set(true);

    this.contentService.getSection<PageSectionsConfig>('home-sections').subscribe({
      next: (data) => {
        if (data?.sections) {
          this.homeSections.set(data.sections);
        }
        this.sectionsConfigLoading.set(false);
      },
      error: () => this.sectionsConfigLoading.set(false),
    });

    this.contentService.getSection<PageSectionsConfig>('about-sections').subscribe({
      next: (data) => {
        if (data?.sections) {
          this.aboutSections.set(data.sections);
        }
      },
    });
  }

  moveSection(page: 'home' | 'about', index: number, direction: 'up' | 'down'): void {
    const sections = page === 'home' ? [...this.homeSections()] : [...this.aboutSections()];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    [sections[index], sections[targetIndex]] = [sections[targetIndex], sections[index]];
    sections.forEach((s, i) => (s.order = i + 1));

    if (page === 'home') {
      this.homeSections.set(sections);
    } else {
      this.aboutSections.set(sections);
    }
  }

  toggleSectionVisibility(page: 'home' | 'about', index: number): void {
    const sections = page === 'home' ? [...this.homeSections()] : [...this.aboutSections()];
    sections[index] = { ...sections[index], visible: !sections[index].visible };

    if (page === 'home') {
      this.homeSections.set(sections);
    } else {
      this.aboutSections.set(sections);
    }
  }

  async saveSectionsConfig(page: 'home' | 'about'): Promise<void> {
    const sectionId = page === 'home' ? 'home-sections' : 'about-sections';
    const data = page === 'home' ? this.homeSections() : this.aboutSections();

    this.sectionsConfigSaving.set(page);
    this.sectionsConfigSuccess.set(null);

    try {
      await this.contentService.updateSection(sectionId, { sections: data });
      this.toast.success('Sections config saved');
    } catch (err: any) {
      console.error('Failed to save sections config:', err);
      this.toast.error('Save failed: ' + (err?.message || 'Unknown error'));
    } finally {
      this.sectionsConfigSaving.set(null);
    }
  }

  // --- Content section helpers ---

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
                const raw = Array.isArray(data[key]) ? data[key] : [];
                // Saved entries are always enabled (save filters by enabled && url)
                this.footerLinks.set(raw.map((l: any) => ({ ...l, enabled: true })));
                continue;
              }
              if (key === 'services' && sectionId === 'services') {
                this.servicesItems.set(Array.isArray(data[key]) ? data[key] : []);
                continue;
              }
              if (key === 'stats' && sectionId === 'about') {
                this.aboutStats.set(Array.isArray(data[key]) ? data[key] : []);
                continue;
              }
              if (key === 'testimonials' && sectionId === 'testimonials') {
                this.testimonialsItems.set(Array.isArray(data[key]) ? data[key] : []);
                continue;
              }
              if (key === 'formFields' && sectionId === 'contact') {
                this.contactFormFields.set(Array.isArray(data[key]) ? data[key] : []);
                continue;
              }
              if (key === 'layout') {
                const layouts = new Map(this.sectionLayouts());
                layouts.set(sectionId, data[key]);
                this.sectionLayouts.set(layouts);
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
      if (field === 'services' || field === 'stats') {
        if (val && val.trim()) {
          try {
            data[field] = JSON.parse(val);
          } catch {
            this.toast.error('Invalid JSON for ' + field);
            this.savingSection.set(null);
            return;
          }
        } else {
          data[field] = null; // Clear the field
        }
      } else {
        data[field] = val ?? ''; // Always include, empty string clears Firestore value
      }
    }

    // Add social links for footer
    if (sectionId === 'footer') {
      data['socialLinks'] = this.footerLinks()
        .filter((l) => l.enabled && l.url)
        .map((l) => ({ platform: l.platform, url: l.url, icon: l.icon || '' }));
    }

    // Add services items
    if (sectionId === 'services') {
      data['services'] = this.servicesItems().filter((s) => s.title);
    }

    // Add about stats
    if (sectionId === 'about') {
      data['stats'] = this.aboutStats().filter((s) => s.label);
    }

    // Add testimonials items
    if (sectionId === 'testimonials') {
      data['testimonials'] = this.testimonialsItems().filter((t) => t.name);
    }

    // Add contact form fields
    if (sectionId === 'contact') {
      data['formFields'] = this.contactFormFields().filter((f) => f.name);
    }

    // Sanitize WhatsApp phone number — digits only
    if (sectionId === 'whatsapp' && data['phoneNumber']) {
      data['phoneNumber'] = String(data['phoneNumber']).replace(/\D/g, '');
    }

    // Add layout field for sections that support it
    const layout = this.sectionLayouts().get(sectionId);
    if (layout) {
      data['layout'] = layout;
    }

    try {
      await this.contentService.updateSection(sectionId, data);
      form.markAsPristine();
      this.toast.success('Section saved');
    } catch (err: any) {
      this.toast.error('Save failed: ' + (err?.message || 'Unknown error'));
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
    // Custom labels for specific fields
    const customLabels: Record<string, string> = {
      phoneNumber: 'WhatsApp Phone Number',
    };
    if (customLabels[field]) return customLabels[field];
    return field.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
  }

  getFieldPlaceholder(field: string): string {
    const placeholders: Record<string, string> = {
      phoneNumber: 'e.g. 5491112345678 (digits only, include country code)',
    };
    return placeholders[field] || '';
  }

  isJsonField(field: string): boolean {
    return false; // All repeaters now use visual UI, no raw JSON
  }

  getJsonPlaceholder(field: string): string {
    return ''; // No longer used — all fields are typed or repeaters
  }

  isLongTextField(field: string): boolean {
    return ['description', 'defaultMessage', 'philosophy', 'extra', 'quote', 'sectionDescription', 'heroSubtitle'].includes(field);
  }

  getInputType(field: string): string {
    if (field.includes('Url') || field === 'image' || field === 'bgImage' || field === 'logoUrl' || field === 'mapEmbed' || field === 'overlayImage') return 'url';
    if (field === 'email') return 'email';
    if (field === 'phone' || field === 'phoneNumber') return 'tel';
    return 'text';
  }

  isRouteField(field: string): boolean {
    return field.endsWith('Route');
  }

  isToggleField(field: string): boolean {
    return field === 'showLinks' || field === 'showSocialLinks';
  }

  getRouteOptions(): RouteOption[] {
    return AVAILABLE_ROUTES;
  }

  // --- Footer social links ---

  getSocialPlatforms() {
    return SOCIAL_PLATFORMS;
  }

  getPlatformInputType(platformId: string): string {
    if (platformId === 'whatsapp' || platformId === 'telegram') return 'tel';
    if (platformId === 'email') return 'email';
    return 'url';
  }

  getPlatformPlaceholder(platformId: string): string {
    if (platformId === 'whatsapp' || platformId === 'telegram') return '5491112345678 (digits only)';
    if (platformId === 'email') return 'you@example.com';
    return 'https://...';
  }

  isPlatformEnabled(platformId: string): boolean {
    return this.footerLinks().some((l) => l.platform === platformId && l.enabled);
  }

  getPlatformUrl(platformId: string): string {
    return this.footerLinks().find((l) => l.platform === platformId)?.url || '';
  }

  getPlatformIcon(platformId: string): string {
    return this.footerLinks().find((l) => l.platform === platformId)?.icon || '';
  }

  togglePlatform(platformId: string): void {
    const platform = SOCIAL_PLATFORMS.find((p) => p.id === platformId);
    if (!platform) return;

    this.footerLinks.update((links) => {
      const existing = links.find((l) => l.platform === platformId);
      if (existing) {
        return links.map((l) =>
          l.platform === platformId ? { ...l, enabled: !l.enabled } : l,
        );
      }
      return [...links, { platform: platformId, url: '', icon: platform.icon, enabled: true }];
    });
    this.clearSuccessOnEdit('footer');
  }

  updatePlatformUrl(platformId: string, url: string): void {
    this.footerLinks.update((links) => {
      const existing = links.find((l) => l.platform === platformId);
      if (existing) {
        return links.map((l) => (l.platform === platformId ? { ...l, url } : l));
      }
      const platform = SOCIAL_PLATFORMS.find((p) => p.id === platformId);
      return [...links, { platform: platformId, url, icon: platform?.icon || '', enabled: true }];
    });
    this.clearSuccessOnEdit('footer');
  }

  openCustomSocialModal(): void {
    this.customSocialName.set('');
    this.customSocialUrl.set('');
    this.showCustomSocialModal.set(true);
  }

  closeCustomSocialModal(): void {
    this.showCustomSocialModal.set(false);
  }

  updateCustomSocialName(value: string): void {
    this.customSocialName.set(value);
  }

  updateCustomSocialUrl(value: string): void {
    this.customSocialUrl.set(value);
  }

  addCustomSocial(): void {
    const name = this.customSocialName().trim();
    const url = this.customSocialUrl().trim();
    if (!name || !url) return;

    this.footerLinks.update((links) => [
      ...links,
      { platform: name, url, icon: '', enabled: true },
    ]);
    this.showCustomSocialModal.set(false);
    this.clearSuccessOnEdit('footer');
  }

  isCustomSocialLink(link: { platform: string; url: string; icon?: string; enabled?: boolean }): boolean {
    return !SOCIAL_PLATFORMS.some((p) => p.id === link.platform);
  }

  removeFooterLink(index: number): void {
    this.footerLinks.update((links) => links.filter((_, i) => i !== index));
    this.clearSuccessOnEdit('footer');
  }

  // --- Services repeater ---

  addServiceItem(): void {
    this.servicesItems.update((items) => [...items, { id: '', title: '', description: '', icon: '' }]);
  }

  removeServiceItem(index: number): void {
    this.servicesItems.update((items) => items.filter((_, i) => i !== index));
  }

  updateServiceItem(index: number, key: 'id' | 'title' | 'description' | 'icon', value: string): void {
    this.servicesItems.update((items) =>
      items.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
    this.clearSuccessOnEdit('services');
  }

  // --- Stats repeater ---

  addStatItem(): void {
    this.aboutStats.update((stats) => [...stats, { value: '', label: '' }]);
  }

  removeStatItem(index: number): void {
    this.aboutStats.update((stats) => stats.filter((_, i) => i !== index));
  }

  updateStatItem(index: number, key: 'value' | 'label', value: string): void {
    this.aboutStats.update((stats) =>
      stats.map((stat, i) => (i === index ? { ...stat, [key]: value } : stat)),
    );
    this.clearSuccessOnEdit('about');
  }

  // --- Testimonials repeater ---

  addTestimonialItem(): void {
    this.testimonialsItems.update((items) => [...items, { name: '', role: '', text: '' }]);
  }

  removeTestimonialItem(index: number): void {
    this.testimonialsItems.update((items) => items.filter((_, i) => i !== index));
  }

  updateTestimonialItem(index: number, key: 'name' | 'role' | 'text', value: string): void {
    this.testimonialsItems.update((items) =>
      items.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
    this.clearSuccessOnEdit('testimonials');
  }

  // --- Contact Form Fields repeater ---

  addFormField(): void {
    this.contactFormFields.update((fields) => [
      ...fields,
      { name: '', type: 'text', label: '', placeholder: '', required: false, validators: [] },
    ]);
  }

  removeFormField(index: number): void {
    this.contactFormFields.update((fields) => fields.filter((_, i) => i !== index));
  }

  updateFormField(index: number, key: 'name' | 'type' | 'label' | 'placeholder', value: string): void {
    this.contactFormFields.update((fields) =>
      fields.map((field, i) => (i === index ? { ...field, [key]: value } : field)),
    );
    this.clearSuccessOnEdit('contact');
  }

  toggleFormFieldRequired(index: number): void {
    this.contactFormFields.update((fields) =>
      fields.map((field, i) => (i === index ? { ...field, required: !field.required } : field)),
    );
    this.clearSuccessOnEdit('contact');
  }

  moveFormField(index: number, direction: 'up' | 'down'): void {
    const fields = [...this.contactFormFields()];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;

    [fields[index], fields[targetIndex]] = [fields[targetIndex], fields[index]];
    this.contactFormFields.set(fields);
    this.clearSuccessOnEdit('contact');
  }

  addFormFieldValidator(fieldIndex: number): void {
    this.contactFormFields.update((fields) =>
      fields.map((field, i) =>
        i === fieldIndex
          ? { ...field, validators: [...field.validators, { type: 'required', message: '' }] }
          : field,
      ),
    );
    this.clearSuccessOnEdit('contact');
  }

  removeFormFieldValidator(fieldIndex: number, validatorIndex: number): void {
    this.contactFormFields.update((fields) =>
      fields.map((field, i) =>
        i === fieldIndex
          ? { ...field, validators: field.validators.filter((_, vi) => vi !== validatorIndex) }
          : field,
      ),
    );
    this.clearSuccessOnEdit('contact');
  }

  updateFormFieldValidator(fieldIndex: number, validatorIndex: number, key: 'type' | 'value' | 'message', value: string): void {
    this.contactFormFields.update((fields) =>
      fields.map((field, i) => {
        if (i !== fieldIndex) return field;
        const validators = field.validators.map((v, vi) => {
          if (vi !== validatorIndex) return v;
          if (key === 'value') {
            const numVal = Number(value);
            return { ...v, value: isNaN(numVal) ? value : numVal };
          }
          return { ...v, [key]: value };
        });
        return { ...field, validators };
      }),
    );
    this.clearSuccessOnEdit('contact');
  }

  // --- Layout management ---

  getLayout(sectionId: string): string {
    return this.sectionLayouts().get(sectionId) || '';
  }

  setLayout(sectionId: string, layout: string): void {
    const layouts = new Map(this.sectionLayouts());
    layouts.set(sectionId, layout);
    this.sectionLayouts.set(layouts);
    this.clearSuccessOnEdit(sectionId);
  }

  hasLayoutOptions(sectionId: string): boolean {
    return sectionId === 'hero' || sectionId === 'services';
  }

  getLayoutOptions(sectionId: string): { value: string; label: string }[] {
    if (sectionId === 'hero') return this.heroLayouts;
    if (sectionId === 'services') return this.servicesLayouts;
    return [];
  }
}
