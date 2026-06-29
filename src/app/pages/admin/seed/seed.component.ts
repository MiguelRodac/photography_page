import { Component, inject, signal } from '@angular/core';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import portfolioData from '../../../../data/portfolio.json';
import servicesData from '../../../../data/services.json';
import siteContent from '../../../../data/site-content.json';

interface SeedLog {
  collection: string;
  status: 'success' | 'error' | 'pending';
  message: string;
}

@Component({
  selector: 'app-seed',
  standalone: true,
  imports: [],
  templateUrl: './seed.component.html',
})
export class SeedComponent {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);

  readonly seeding = signal(false);
  readonly done = signal(false);
  readonly logs = signal<SeedLog[]>([]);

  async runSeed(): Promise<void> {
    this.seeding.set(true);
    this.done.set(false);
    this.logs.set([]);

    try {
      await this.seedPortfolio();
      await this.seedServices();
      await this.seedSiteContent();
      await this.seedPageSections();
      await this.seedNavigation();
      await this.seedCategories();
      await this.seedTheme();
      await this.seedAdminUser();

      this.addLog('ALL', 'success', 'Seed completed successfully!');
    } catch (err: any) {
      this.addLog('ERROR', 'error', err?.message || 'Unknown error');
    } finally {
      this.seeding.set(false);
      this.done.set(true);
    }
  }

  private addLog(collectionName: string, status: 'success' | 'error' | 'pending', message: string): void {
    this.logs.update((logs) => [...logs, { collection: collectionName, status, message }]);
  }

  private async seedPortfolio(): Promise<void> {
    const colRef = collection(this.firestore, 'portfolio');
    for (const item of portfolioData) {
      const docRef = doc(colRef, String(item.id));
      await setDoc(docRef, {
        id: String(item.id),
        title: item.title,
        description: item.description,
        category: item.category,
        img: item.img,
        imageSource: 'url' as const,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { merge: true });
    }
    this.addLog('portfolio', 'success', `Seeded ${portfolioData.length} items`);
  }

  private async seedServices(): Promise<void> {
    const docRef = doc(this.firestore, 'content/services');
    await setDoc(docRef, { services: servicesData }, { merge: true });
    this.addLog('content/services', 'success', `Seeded ${servicesData.length} services`);
  }

  private async seedSiteContent(): Promise<void> {
    const content = siteContent;

    // Hero
    const heroRef = doc(this.firestore, 'content/hero');
    await setDoc(heroRef, {
      title: content.hero.title,
      subtitle: content.hero.subtitle,
      cta: content.hero.cta,
      bgImage: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1920&q=80',
      layout: 'parallax',
    }, { merge: true });
    this.addLog('content/hero', 'success', 'Seeded hero content');

    // About
    const aboutRef = doc(this.firestore, 'content/about');
    await setDoc(aboutRef, {
      title: 'Capturando historias',
      subtitle: 'desde hace 10 años',
      description: 'Soy fotógrafo profesional especializado en retratos, bodas y fotografía comercial. Mi pasión es encontrar la belleza en los momentos cotidianos y transformarlos en recuerdos que duran para siempre.',
      extra: 'Cada sesión es una colaboración. Trabajo codo a codo con mis clientes para entender su visión y crear imágenes que cuenten su historia de manera auténtica y emotiva.',
      quote: '"No solo tomo fotos, creo recuerdos visuales que trascienden el tiempo."',
      philosophy: 'Creo en la fotografía como una forma de arte que combina técnica, creatividad y emoción. Cada imagen que entrego es el resultado de una cuidadosa planificación, una ejecución precisa y un proceso de edición meticuloso.',
      image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80',
      stats: [
        { value: '500+', label: 'Sesiones' },
        { value: '150+', label: 'Clientes' },
        { value: '10', label: 'Años exp.' },
      ],
      services: [
        { id: 'events', title: 'Bodas y eventos', description: 'Cobertura completa de tu día especial con un enfoque documental que captura cada emoción genuina.', icon: 'https://api.iconify.design/mdi/camera.svg' },
        { id: 'portrait', title: 'Retratos', description: 'Sesiones personalizadas que reflejan tu personalidad, desde retratos profesionales hasta familiares.', icon: 'https://api.iconify.design/mdi/account.svg' },
        { id: 'commercial', title: 'Comercial', description: 'Fotografía de producto, arquitectura y contenido visual para impulsar tu marca o negocio.', icon: 'https://api.iconify.design/mdi/briefcase-outline.svg' },
        { id: 'editing', title: 'Edición profesional', description: 'Procesamiento digital avanzado con atención al color, iluminación y detalle en cada imagen.', icon: 'https://api.iconify.design/mdi/palette-outline.svg' },
      ],
    }, { merge: true });
    this.addLog('content/about', 'success', 'Seeded about content');

    // Contact
    const contactRef = doc(this.firestore, 'content/contact');
    await setDoc(contactRef, {
      title: content.contact.title,
      subtitle: content.contact.subtitle || 'Cuéntame sobre tu proyecto',
      email: 'info@photographyacas.com',
      phone: '+54 11 1234-5678',
      address: content.contact.address,
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26249.96372986841!2d-58.4!3d-34.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDM2JzAwLjAiUyA1OMKwMjQnMDAuMCJX!5e0!3m2!1ses!2sar!4v1',
      formFields: [
        {
          name: 'name',
          type: 'text',
          label: 'Nombre completo',
          placeholder: 'Ej: María García',
          required: true,
          validators: [
            { type: 'required', message: 'El nombre es obligatorio' },
            { type: 'minLength', value: 3, message: 'Mínimo 3 caracteres' },
          ],
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'tu@email.com',
          required: true,
          validators: [
            { type: 'required', message: 'El email es obligatorio' },
            { type: 'email', message: 'Formato de email inválido' },
          ],
        },
        {
          name: 'phone',
          type: 'tel',
          label: 'Teléfono (opcional)',
          placeholder: '+54 11 1234-5678',
          required: false,
          validators: [],
        },
        {
          name: 'message',
          type: 'textarea',
          label: 'Contame tu idea',
          placeholder: 'Describí tu proyecto, fecha estimada, presupuesto...',
          required: true,
          validators: [
            { type: 'required', message: 'El mensaje es obligatorio' },
            { type: 'minLength', value: 10, message: 'Mínimo 10 caracteres' },
            { type: 'maxLength', value: 800, message: 'Máximo 800 caracteres' },
          ],
        },
      ],
    }, { merge: true });
    this.addLog('content/contact', 'success', 'Seeded contact content');

    // Header
    const headerRef = doc(this.firestore, 'content/header');
    await setDoc(headerRef, {
      siteName: 'Photography ACAS',
      logoUrl: '',
    }, { merge: true });
    this.addLog('content/header', 'success', 'Seeded header content');

    // Footer
    const footerRef = doc(this.firestore, 'content/footer');
    await setDoc(footerRef, {
      copyrightText: `© ${new Date().getFullYear()} Photography ACAS. All Rights Reserved.`,
      socialLinks: [
        { platform: 'Instagram', url: 'https://instagram.com/photographyacas' },
        { platform: 'Facebook', url: 'https://facebook.com/photographyacas' },
        { platform: 'WhatsApp', url: 'https://wa.me/5491112345678' },
      ],
    }, { merge: true });
    this.addLog('content/footer', 'success', 'Seeded footer content');

    // WhatsApp
    const whatsappRef = doc(this.firestore, 'content/whatsapp');
    await setDoc(whatsappRef, {
      phoneNumber: '+5491112345678',
      defaultMessage: 'Hola! Me gustaría consultar sobre sus servicios de fotografía.',
    }, { merge: true });
    this.addLog('content/whatsapp', 'success', 'Seeded whatsapp content');

    // Settings
    const settingsRef = doc(this.firestore, 'content/settings');
    await setDoc(settingsRef, {
      siteName: 'Photography ACAS',
      logoUrl: '',
      footerText: `© ${new Date().getFullYear()} Photography ACAS. All Rights Reserved.`,
    }, { merge: true });
    this.addLog('content/settings', 'success', 'Seeded settings content');
  }

  private async seedPageSections(): Promise<void> {
    const homeRef = doc(this.firestore, 'content/home-sections');
    await setDoc(homeRef, {
      sections: [
        { id: 'hero', visible: true, order: 1 },
        { id: 'services', visible: true, order: 2 },
        { id: 'portfolio-preview', visible: true, order: 3 },
        { id: 'testimonials', visible: true, order: 4 },
        { id: 'cta', visible: true, order: 5 },
      ],
    }, { merge: true });
    this.addLog('content/home-sections', 'success', 'Seeded home page sections config');

    const aboutRef = doc(this.firestore, 'content/about-sections');
    await setDoc(aboutRef, {
      sections: [
        { id: 'hero', visible: true, order: 1 },
        { id: 'philosophy', visible: true, order: 2 },
        { id: 'services', visible: true, order: 3 },
        { id: 'cta', visible: true, order: 4 },
      ],
    }, { merge: true });
    this.addLog('content/about-sections', 'success', 'Seeded about page sections config');
  }

  private async seedNavigation(): Promise<void> {
    const navItems = [
      { label: 'Home', path: '/', order: 1, visible: true },
      { label: 'Portfolio', path: '/portfolio', order: 2, visible: true },
      { label: 'About Me', path: '/about-me', order: 3, visible: true },
      { label: 'Contact', path: '/contact', order: 4, visible: true },
    ];

    const colRef = collection(this.firestore, 'navigation');
    for (const [idx, item] of navItems.entries()) {
      const docRef = doc(colRef, `nav-${idx + 1}`);
      await setDoc(docRef, { ...item }, { merge: true });
    }
    this.addLog('navigation', 'success', `Seeded ${navItems.length} navigation items`);
  }

  private async seedCategories(): Promise<void> {
    const categories = [
      { name: 'Wedding', slug: 'wedding', order: 1 },
      { name: 'Portrait', slug: 'portrait', order: 2 },
      { name: 'Landscape', slug: 'landscape', order: 3 },
      { name: 'Events', slug: 'event', order: 4 },
      { name: 'Commercial', slug: 'commercial', order: 5 },
    ];

    const colRef = collection(this.firestore, 'categories');
    for (const [idx, cat] of categories.entries()) {
      const docRef = doc(colRef, `cat-${idx + 1}`);
      await setDoc(docRef, { ...cat }, { merge: true });
    }
    this.addLog('categories', 'success', `Seeded ${categories.length} categories`);
  }

  private async seedTheme(): Promise<void> {
    const docRef = doc(this.firestore, 'content/theme');
    await setDoc(docRef, {
      primaryColor: '#d4892e',
      primaryHover: '#bd7023',
      displayFont: '"Cormorant Garamond"',
      bodyFont: '"Inter"',
      borderRadius: '12px',
      darkModeDefault: false,
    }, { merge: true });
    this.addLog('content/theme', 'success', 'Seeded theme settings');
  }

  private async seedAdminUser(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      this.addLog('users', 'error', 'No authenticated user — log in first, then seed');
      return;
    }

    const docRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(docRef, {
      email: user.email || '',
      role: 'super-admin',
      displayName: user.displayName || user.email?.split('@')[0] || 'Admin',
      createdAt: new Date(),
    }, { merge: true });
    this.addLog('users', 'success', `Seeded super-admin role for ${user.email}`);
  }
}
