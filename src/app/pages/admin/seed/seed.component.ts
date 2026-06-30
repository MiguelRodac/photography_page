import { Component, inject, signal } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { I18nService } from '../../../services/i18n.service';

interface SeedLog { collection: string; status: 'success' | 'error' | 'pending'; message: string; }

@Component({
  selector: 'app-seed',
  standalone: true,
  imports: [ConfirmDialogComponent],
  templateUrl: './seed.component.html',
})
export class SeedComponent {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);
  readonly i18n = inject(I18nService);

  readonly seeding = signal(false);
  readonly clearing = signal(false);
  readonly showClearConfirm = signal(false);
  readonly showSeedConfirm = signal(false);
  readonly showDeleteConfirm = signal(false);
  readonly done = signal(false);
  readonly logs = signal<SeedLog[]>([]);
  readonly sectionStatus = signal<Record<string, 'idle' | 'success' | 'error'>>({});
  readonly selectedSections = signal<Set<string>>(new Set());

  readonly sections = [
    { id: 'hero', label: 'Hero' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'header', label: 'Header' },
    { id: 'footer', label: 'Footer' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'theme', label: 'Theme' },
    { id: 'settings', label: 'Settings' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'portfolio-preview', label: 'Portfolio Preview' },
    { id: 'portfolio-page', label: 'Portfolio Page' },
    { id: 'cta', label: 'CTA' },
    { id: 'page-sections', label: 'Page Sections' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'categories', label: 'Categories' },
    { id: 'portfolio', label: 'Portfolio Items' },
    { id: 'users', label: 'Admin User' },
  ];

  private addLog(collection: string, status: 'success' | 'error' | 'pending', message: string): void {
    this.logs.update(l => [...l, { collection, status, message }]);
  }

  private setSectionStatus(section: string, status: 'success' | 'error'): void {
    this.sectionStatus.update(s => ({ ...s, [section]: status }));
  }

  private async existingDate(docPath: string): Promise<Date | null> {
    const snap = await getDoc(doc(this.firestore, docPath));
    return snap.exists() && snap.data()?.['createdAt']?.toDate?.() || null;
  }

  /* ── Selection ── */

  isSelected(id: string): boolean {
    return this.selectedSections().has(id);
  }

  toggleSection(id: string): void {
    this.selectedSections.update(s => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  selectAll(): void {
    this.selectedSections.set(new Set(this.sections.map(s => s.id)));
  }

  deselectAll(): void {
    this.selectedSections.set(new Set());
  }

  get allSelected(): boolean {
    return this.selectedSections().size === this.sections.length;
  }

  get selectedCount(): number {
    return this.selectedSections().size;
  }

  getSeedConfirmMessage(): string {
    return this.i18n.t('SEED.CONFIRM_SEED_MSG').replace('{count}', this.selectedCount.toString());
  }

  getDeleteConfirmMessage(): string {
    return this.i18n.t('SEED.CONFIRM_DELETE_MSG').replace('{count}', this.selectedCount.toString());
  }

  /* ── Seed All ── */

  async runSeedAll(): Promise<void> {
    this.seeding.set(true); this.logs.set([]);
    try {
      await this.seedHero(); await this.seedServices();
      await this.seedAbout(); await this.seedContact();
      await this.seedHeader(); await this.seedFooter();
      await this.seedWhatsapp(); await this.seedTheme();
      await this.seedSettings(); await this.seedTestimonials();
      await this.seedPortfolioPreview(); await this.seedPortfolioPage();
      await this.seedCta();
      await this.seedPageSections(); await this.seedNavigation();
      await this.seedCategories(); await this.seedPortfolio();
      await this.seedAdminUser();
      this.addLog('ALL', 'success', 'Seed completed!');
    } catch (e: any) { this.addLog('ERROR', 'error', e.message); }
    finally { this.seeding.set(false); this.done.set(true); }
  }

  /* ── Seed Selected ── */

  requestSeedSelected(): void {
    if (this.selectedCount === 0) return;
    this.showSeedConfirm.set(true);
  }

  cancelSeed(): void { this.showSeedConfirm.set(false); }

  async seedSelected(): Promise<void> {
    this.showSeedConfirm.set(false);
    this.seeding.set(true); this.logs.set([]);
    const selected = this.selectedSections();
    const seedMap: Record<string, () => Promise<void>> = {
      'hero': () => this.seedHero(),
      'services': () => this.seedServices(),
      'about': () => this.seedAbout(),
      'contact': () => this.seedContact(),
      'header': () => this.seedHeader(),
      'footer': () => this.seedFooter(),
      'whatsapp': () => this.seedWhatsapp(),
      'theme': () => this.seedTheme(),
      'settings': () => this.seedSettings(),
      'testimonials': () => this.seedTestimonials(),
      'portfolio-preview': () => this.seedPortfolioPreview(),
      'portfolio-page': () => this.seedPortfolioPage(),
      'cta': () => this.seedCta(),
      'page-sections': () => this.seedPageSections(),
      'navigation': () => this.seedNavigation(),
      'categories': () => this.seedCategories(),
      'portfolio': () => this.seedPortfolio(),
      'users': () => this.seedAdminUser(),
    };
    try {
      for (const id of selected) {
        const fn = seedMap[id];
        if (fn) await fn();
      }
      this.addLog('SELECTED', 'success', `Seeded ${selected.size} section(s)`);
    } catch (e: any) { this.addLog('ERROR', 'error', e.message); }
    finally { this.seeding.set(false); this.done.set(true); }
  }

  /* ── Delete Selected ── */

  requestDeleteSelected(): void {
    if (this.selectedCount === 0) return;
    this.showDeleteConfirm.set(true);
  }

  cancelDeleteSelected(): void { this.showDeleteConfirm.set(false); }

  async deleteSelected(): Promise<void> {
    this.showDeleteConfirm.set(false);
    this.clearing.set(true); this.logs.set([]);
    const selected = this.selectedSections();
    try {
      for (const id of selected) {
        await this.deleteSection(id);
      }
      this.addLog('SELECTED', 'success', `Deleted ${selected.size} section(s)`);
    } catch (e: any) { this.addLog('ERROR', 'error', e.message); }
    finally { this.clearing.set(false); }
  }

  async deleteSection(sectionId: string): Promise<void> {
    const sectionPaths: Record<string, { type: 'doc'; path: string } | { type: 'collection'; path: string }> = {
      'hero': { type: 'doc', path: 'content/hero' },
      'services': { type: 'doc', path: 'content/services' },
      'about': { type: 'doc', path: 'content/about' },
      'contact': { type: 'doc', path: 'content/contact' },
      'header': { type: 'doc', path: 'content/header' },
      'footer': { type: 'doc', path: 'content/footer' },
      'whatsapp': { type: 'doc', path: 'content/whatsapp' },
      'theme': { type: 'doc', path: 'content/theme' },
      'settings': { type: 'doc', path: 'content/settings' },
      'testimonials': { type: 'doc', path: 'content/testimonials' },
      'portfolio-preview': { type: 'doc', path: 'content/portfolio-preview' },
      'portfolio-page': { type: 'doc', path: 'content/portfolio' },
      'cta': { type: 'doc', path: 'content/cta' },
      'page-sections': { type: 'doc', path: 'content/home-sections' },
      'navigation': { type: 'collection', path: 'navigation' },
      'categories': { type: 'collection', path: 'categories' },
      'portfolio': { type: 'collection', path: 'portfolio' },
    };

    const entry = sectionPaths[sectionId];
    if (!entry) {
      if (sectionId === 'users') {
        const user = this.auth.currentUser;
        if (!user) { this.addLog('users', 'error', 'Log in first'); return; }
        await deleteDoc(doc(this.firestore, `users/${user.uid}`));
        this.addLog('users', 'success', 'Admin user deleted');
        this.setSectionStatus('users', 'success');
        return;
      }
      this.addLog(sectionId, 'error', 'Unknown section');
      return;
    }

    if (entry.type === 'doc') {
      await deleteDoc(doc(this.firestore, entry.path));
      this.addLog(sectionId, 'success', `Deleted ${entry.path}`);
    } else {
      const snap = await getDocs(collection(this.firestore, entry.path));
      for (const d of snap.docs) await deleteDoc(d.ref);
      this.addLog(sectionId, 'success', `Deleted ${snap.size} docs from ${entry.path}`);
    }

    // page-sections also has about-sections
    if (sectionId === 'page-sections') {
      await deleteDoc(doc(this.firestore, 'content/about-sections'));
      this.addLog('page-sections', 'success', 'Deleted content/about-sections');
    }

    this.setSectionStatus(sectionId, 'success');
  }

  /* ── Clear All ── */

  requestClearAll(): void { this.showClearConfirm.set(true); }
  cancelClear(): void { this.showClearConfirm.set(false); }

  async clearAll(): Promise<void> {
    this.showClearConfirm.set(false);
    this.clearing.set(true); this.logs.set([]);
    try {
      const collections = ['content', 'portfolio', 'navigation', 'categories', 'users'];
      for (const col of collections) {
        const snap = await getDocs(collection(this.firestore, col));
        for (const d of snap.docs) await deleteDoc(d.ref);
        this.addLog(col, 'success', `Cleared ${snap.size} docs`);
      }
      // Clear localStorage cache
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('content_') || key === 'photography_admin_auth')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      
      this.addLog('ALL', 'success', 'All data cleared');
    } catch (e: any) { this.addLog('ERROR', 'error', e.message); }
    finally { this.clearing.set(false); }
  }

  /* ── Section seeds ── */

  async seedHero(): Promise<void> {
    const path = 'content/hero';
    const existing = await this.existingDate(path);
    await setDoc(doc(this.firestore, path), {
      title: 'Capturando momentos únicos',
      subtitle: 'Fotografía profesional para bodas, retratos y eventos',
      cta: 'Ver portafolio',
      ctaRoute: '/portfolio',
      bgImage: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1920&q=80',
      layout: 'parallax',
      ...(existing ? {} : { createdAt: new Date() }),
    }, { merge: true });
    this.addLog('hero', 'success', 'Hero seeded'); this.setSectionStatus('hero', 'success');
  }

  async seedServices(): Promise<void> {
    const path = 'content/services';
    const existing = await this.existingDate(path);
    await setDoc(doc(this.firestore, path), {
      sectionTitle: 'Servicios',
      sectionDescription: 'Cada proyecto es único. Ofrezco servicios adaptados a tus necesidades.',
      services: [
        { id: 'wedding', title: 'Bodas y eventos', description: 'Cobertura completa de tu día especial con un enfoque documental que captura cada emoción genuina.', icon: 'https://api.iconify.design/mdi/camera.svg' },
        { id: 'portrait', title: 'Retratos', description: 'Sesiones personalizadas que reflejan tu personalidad, desde retratos profesionales hasta familiares.', icon: 'https://api.iconify.design/mdi/account.svg' },
        { id: 'commercial', title: 'Comercial', description: 'Fotografía de producto, arquitectura y contenido visual para impulsar tu marca o negocio.', icon: 'https://api.iconify.design/mdi/briefcase-outline.svg' },
        { id: 'editing', title: 'Edición profesional', description: 'Procesamiento digital avanzado con atención al color, iluminación y detalle en cada imagen.', icon: 'https://api.iconify.design/mdi/palette-outline.svg' },
      ],
      ...(existing ? {} : { createdAt: new Date() }),
    }, { merge: true });
    this.addLog('services', 'success', 'Services seeded'); this.setSectionStatus('services', 'success');
  }

  async seedAbout(): Promise<void> {
    const path = 'content/about';
    const existing = await this.existingDate(path);
    await setDoc(doc(this.firestore, path), {
      heroLabel: 'Sobre mí',
      title: 'Capturando historias',
      subtitle: 'desde hace 10 años',
      description: 'Soy fotógrafo profesional especializado en retratos, bodas y fotografía comercial.',
      extra: 'Cada sesión es una colaboración. Trabajo codo a codo con mis clientes para entender su visión.',
      quote: '"No solo tomo fotos, creo recuerdos visuales que trascienden el tiempo."',
      philosophy: 'Creo en la fotografía como una forma de arte que combina técnica, creatividad y emoción.',
      image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80',
      profileImageAlt: 'Fotógrafo en acción',
      overlayImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80',
      overlayImageAlt: 'Cámara profesional',
      philosophyLabel: 'Mi filosofía',
      servicesLabel: 'Servicios',
      servicesTitle: 'Lo que ofrezco',
      ctaRoute: '/contact',
      stats: [{ value: '500+', label: 'Sesiones' }, { value: '150+', label: 'Clientes' }, { value: '10', label: 'Años exp.' }],
      services: [
        { id: 'events', title: 'Bodas y eventos', description: 'Cobertura completa de tu día especial.', icon: 'https://api.iconify.design/mdi/camera.svg' },
        { id: 'portrait', title: 'Retratos', description: 'Sesiones personalizadas que reflejan tu personalidad.', icon: 'https://api.iconify.design/mdi/account.svg' },
        { id: 'commercial', title: 'Comercial', description: 'Fotografía de producto y contenido visual.', icon: 'https://api.iconify.design/mdi/briefcase-outline.svg' },
        { id: 'editing', title: 'Edición profesional', description: 'Procesamiento digital avanzado.', icon: 'https://api.iconify.design/mdi/palette-outline.svg' },
      ],
      ...(existing ? {} : { createdAt: new Date() }),
    }, { merge: true });
    this.addLog('about', 'success', 'About seeded'); this.setSectionStatus('about', 'success');
  }

  async seedContact(): Promise<void> {
    const path = 'content/contact';
    const existing = await this.existingDate(path);
    await setDoc(doc(this.firestore, path), {
      heroLabel: 'Contacto',
      heroTitle: 'Hagamos realidad',
      heroTitleAccent: 'tu proyecto',
      heroSubtitle: 'Completa el formulario y cuéntame tu idea. Te responderé en menos de 24 horas.',
      bgImage: 'https://images.unsplash.com/photo-1473968512527-509dea398408?auto=format&fit=crop&w=1920&q=80',
      formTitle: 'Envíame tu consulta',
      formSubtitle: 'Campos marcados con * son obligatorios',
      serviceTypeLabel: '¿Qué tipo de sesión te interesa?',
      serviceTypeError: 'Seleccioná un tipo de sesión para continuar',
      serviceTypes: [{ value: 'wedding', label: 'Boda' }, { value: 'portrait', label: 'Retrato' }, { value: 'event', label: 'Evento' }, { value: 'commercial', label: 'Comercial' }],
      email: 'contacto@photographyacas.com',
      phone: '+54 11 1234-5678',
      address: 'Palermo Soho, Buenos Aires',
      mapEmbed: 'https://www.google.com/maps/embed?pb=...',
      infoEmailLabel: 'Email',
      infoLocationLabel: 'Ubicación',
      infoResponseLabel: 'Respuesta',
      infoResponseValue: 'Menos de 24 horas',
      whatsappTitle: '¿Prefieres WhatsApp?',
      whatsappSubtitle: 'Respondo más rápido por aquí',
      statsValue: '500+',
      statsLabel: 'clientes satisfechos',
      formFields: [
        { name: 'name', type: 'text', label: 'Nombre completo', placeholder: 'Ej: María García', required: true, validators: [{ type: 'required', message: 'El nombre es obligatorio' }, { type: 'minLength', value: 3, message: 'Mínimo 3 caracteres' }] },
        { name: 'email', type: 'email', label: 'Email', placeholder: 'tu@email.com', required: true, validators: [{ type: 'required', message: 'El email es obligatorio' }, { type: 'email', message: 'Formato de email inválido' }] },
        { name: 'phone', type: 'tel', label: 'Teléfono (opcional)', placeholder: '+54 11 1234-5678', required: false, validators: [] },
        { name: 'message', type: 'textarea', label: 'Contame tu idea', placeholder: 'Describí tu proyecto...', required: true, validators: [{ type: 'required', message: 'El mensaje es obligatorio' }, { type: 'minLength', value: 10, message: 'Mínimo 10 caracteres' }] },
      ],
      ...(existing ? {} : { createdAt: new Date() }),
    }, { merge: true });
    this.addLog('contact', 'success', 'Contact seeded'); this.setSectionStatus('contact', 'success');
  }

  async seedHeader(): Promise<void> {
    const path = 'content/header';
    const existing = await this.existingDate(path);
    await setDoc(doc(this.firestore, path), {
      siteName: 'Photography ACAS',
      logoUrl: 'https://api.iconify.design/mdi/camera.svg',
      ...(existing ? {} : { createdAt: new Date() }),
    }, { merge: true });
    this.addLog('header', 'success', 'Header seeded'); this.setSectionStatus('header', 'success');
  }

  async seedFooter(): Promise<void> {
    const path = 'content/footer';
    const existing = await this.existingDate(path);
    await setDoc(doc(this.firestore, path), {
      copyrightText: `© ${new Date().getFullYear()} Photography ACAS. All Rights Reserved.`,
      tagline: 'Capturando momentos únicos que duran para siempre.',
      linksTitle: 'Links',
      showLinks: true,
      socialTitle: 'Sígueme',
      showSocialLinks: true,
      socialLinks: [
        { platform: 'instagram', url: 'https://instagram.com/', icon: 'mdi:instagram', enabled: true },
        { platform: 'facebook', url: 'https://facebook.com/', icon: 'mdi:facebook', enabled: true },
        { platform: 'whatsapp', url: 'https://wa.me/5491112345678', icon: 'mdi:whatsapp', enabled: true },
      ],
      ...(existing ? {} : { createdAt: new Date() }),
    }, { merge: true });
    this.addLog('footer', 'success', 'Footer seeded'); this.setSectionStatus('footer', 'success');
  }

  async seedWhatsapp(): Promise<void> {
    const path = 'content/whatsapp';
    const existing = await this.existingDate(path);
    await setDoc(doc(this.firestore, path), {
      phoneNumber: '5491112345678',
      defaultMessage: 'Hola! Me gustaría consultar sobre sus servicios de fotografía.',
      buttonTooltip: '¿Hablamos?',
      buttonAriaLabel: 'Contactar por WhatsApp',
      ...(existing ? {} : { createdAt: new Date() }),
    }, { merge: true });
    this.addLog('whatsapp', 'success', 'WhatsApp seeded'); this.setSectionStatus('whatsapp', 'success');
  }

  async seedTheme(): Promise<void> {
    const path = 'content/theme';
    await setDoc(doc(this.firestore, path), {
      primaryColor: '#d4892e', primaryHover: '#bd7023',
      displayFont: '"Cormorant Garamond"', bodyFont: '"Inter"',
      borderRadius: '12px', darkModeDefault: false,
    }, { merge: true });
    this.addLog('theme', 'success', 'Theme seeded'); this.setSectionStatus('theme', 'success');
  }

  async seedSettings(): Promise<void> {
    const path = 'content/settings';
    await setDoc(doc(this.firestore, path), {
      siteName: 'Photography ACAS', logoUrl: '',
      footerText: `© ${new Date().getFullYear()} Photography ACAS. All Rights Reserved.`,
    }, { merge: true });
    this.addLog('settings', 'success', 'Settings seeded'); this.setSectionStatus('settings', 'success');
  }

  async seedTestimonials(): Promise<void> {
    const path = 'content/testimonials';
    const existing = await this.existingDate(path);
    await setDoc(doc(this.firestore, path), {
      sectionTitle: 'Testimonios', sectionDescription: 'Lo que dicen mis clientes',
      testimonials: [
        { name: 'María García', role: 'Boda • Mayo 2024', text: 'Increíble trabajo. Capturó cada momento especial de nuestra boda con una sensibilidad única.' },
        { name: 'Carlos Mendoza', role: 'Retrato Corporativo', text: 'Profesionalismo absoluto. Las fotos para nuestro equipo directivo quedaron impecables.' },
        { name: 'Ana López', role: 'Sesión Familiar', text: 'Hizo que toda la familia se sintiera cómoda. Las fotos naturales son justo lo que queríamos.' },
      ],
      ...(existing ? {} : { createdAt: new Date() }),
    }, { merge: true });
    this.addLog('testimonials', 'success', 'Testimonials seeded'); this.setSectionStatus('testimonials', 'success');
  }

  async seedPortfolioPreview(): Promise<void> {
    const path = 'content/portfolio-preview';
    const existing = await this.existingDate(path);
    await setDoc(doc(this.firestore, path), {
      sectionTitle: 'Portafolio', sectionDescription: 'Una selección de mi mejor trabajo',
      ctaText: 'Ver portafolio completo', ctaRoute: '/portfolio',
      ...(existing ? {} : { createdAt: new Date() }),
    }, { merge: true });
    this.addLog('portfolio-preview', 'success', 'Portfolio Preview seeded'); this.setSectionStatus('portfolio-preview', 'success');
  }

  async seedCta(): Promise<void> {
    const path = 'content/cta';
    const existing = await this.existingDate(path);
    await setDoc(doc(this.firestore, path), {
      title: 'Trabajemos juntos',
      description: 'Estoy siempre abierto a nuevos proyectos y colaboraciones. Cuéntame tu idea.',
      buttonText: 'Contáctame',
      ctaRoute: '/contact',
      ...(existing ? {} : { createdAt: new Date() }),
    }, { merge: true });
    this.addLog('cta', 'success', 'CTA seeded'); this.setSectionStatus('cta', 'success');
  }

  async seedPageSections(): Promise<void> {
    await setDoc(doc(this.firestore, 'content/home-sections'), {
      sections: [
        { id: 'hero', visible: true, order: 1 }, { id: 'services', visible: true, order: 2 },
        { id: 'portfolio-preview', visible: true, order: 3 }, { id: 'testimonials', visible: true, order: 4 },
        { id: 'cta', visible: true, order: 5 },
      ],
    }, { merge: true });
    await setDoc(doc(this.firestore, 'content/about-sections'), {
      sections: [
        { id: 'hero', visible: true, order: 1 }, { id: 'philosophy', visible: true, order: 2 },
        { id: 'services', visible: true, order: 3 }, { id: 'cta', visible: true, order: 4 },
      ],
    }, { merge: true });
    this.addLog('page-sections', 'success', 'Page sections seeded'); this.setSectionStatus('page-sections', 'success');
  }

  async seedNavigation(): Promise<void> {
    const items = [
      { label: 'Home', path: '/', order: 1, visible: true },
      { label: 'Portfolio', path: '/portfolio', order: 2, visible: true },
      { label: 'About Me', path: '/about-me', order: 3, visible: true },
      { label: 'Contact', path: '/contact', order: 4, visible: true },
    ];
    for (const [i, item] of items.entries()) {
      await setDoc(doc(this.firestore, `navigation/nav-${i + 1}`), item, { merge: true });
    }
    this.addLog('navigation', 'success', 'Navigation seeded'); this.setSectionStatus('navigation', 'success');
  }

  async seedCategories(): Promise<void> {
    const cats = [
      { name: 'Wedding', slug: 'wedding', order: 1 }, { name: 'Portrait', slug: 'portrait', order: 2 },
      { name: 'Landscape', slug: 'landscape', order: 3 }, { name: 'Events', slug: 'event', order: 4 },
      { name: 'Commercial', slug: 'commercial', order: 5 },
    ];
    for (const [i, c] of cats.entries()) {
      await setDoc(doc(this.firestore, `categories/cat-${i + 1}`), c, { merge: true });
    }
    this.addLog('categories', 'success', 'Categories seeded'); this.setSectionStatus('categories', 'success');
  }

  async seedPortfolioPage(): Promise<void> {
    const path = 'content/portfolio';
    const existing = await this.existingDate(path);
    await setDoc(doc(this.firestore, path), {
      pageTitle: 'Portafolio',
      pageSubtitle: 'Una selección de mi mejor trabajo. Cada imagen cuenta una historia única.',
      emptyMessage: 'No hay imágenes en esta categoría aún.',
      ...(existing ? {} : { createdAt: new Date() }),
    }, { merge: true });
    this.addLog('portfolio-page', 'success', 'Portfolio page seeded'); this.setSectionStatus('portfolio-page', 'success');
  }

  async seedPortfolio(): Promise<void> {
    // Seed portfolio items
    const items = [
      { id: '1', title: 'Boda en la playa', description: 'Ceremonia íntima al atardecer', category: 'wedding', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600' },
      { id: '2', title: 'Retrato urbano', description: 'Sesión en el centro histórico', category: 'portrait', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600' },
      { id: '3', title: 'Paisaje montañoso', description: 'Amanecer en los Alpes', category: 'landscape', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600' },
      { id: '4', title: 'Evento corporativo', description: 'Conferencia anual de tecnología', category: 'event', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600' },
      { id: '5', title: 'Producto comercial', description: 'Sesión de catálogo para marca local', category: 'commercial', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600' },
      { id: '6', title: 'Boda campestre', description: 'Celebración al aire libre', category: 'wedding', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600' },
      { id: '7', title: 'Retrato familiar', description: 'Sesión en el parque', category: 'portrait', img: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600' },
      { id: '8', title: 'Amanecer en la costa', description: 'Paisaje marino al amanecer', category: 'landscape', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600' },
      { id: '9', title: 'Fiesta de gala', description: 'Evento benéfico anual', category: 'event', img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600' },
      { id: '10', title: 'Gastronomía', description: 'Fotos para menú de restaurante', category: 'commercial', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600' },
      { id: '11', title: 'Boda vintage', description: 'Estilo retro en locación histórica', category: 'wedding', img: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600' },
      { id: '12', title: 'Sesión boudoir', description: 'Fotografía íntima y elegante', category: 'portrait', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600' },
    ];
    for (const item of items) {
      const snap = await getDoc(doc(this.firestore, `portfolio/${item.id}`));
      const existingDate = snap.exists() ? snap.data()?.['createdAt']?.toDate?.() || null : null;
      await setDoc(doc(this.firestore, `portfolio/${item.id}`), {
        id: item.id, title: item.title, description: item.description,
        category: item.category, img: item.img, imageSource: 'url',
        deleted: false, updatedAt: new Date(),
        ...(existingDate ? { createdAt: existingDate } : { createdAt: new Date() }),
      }, { merge: true });
    }
    this.addLog('portfolio', 'success', `Seeded ${items.length} portfolio items`); this.setSectionStatus('portfolio', 'success');
  }

  async seedAdminUser(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) { this.addLog('users', 'error', 'Log in first'); return; }
    const snap = await getDoc(doc(this.firestore, `users/${user.uid}`));
    const existingDate = snap.exists() ? snap.data()?.['createdAt']?.toDate?.() || null : null;
    await setDoc(doc(this.firestore, `users/${user.uid}`), {
      email: user.email || '', role: 'super-admin',
      displayName: user.displayName || user.email?.split('@')[0] || 'Admin',
      ...(existingDate ? { createdAt: existingDate } : { createdAt: new Date() }),
    }, { merge: true });
    this.addLog('users', 'success', `Super-admin role for ${user.email}`); this.setSectionStatus('users', 'success');
  }
}
