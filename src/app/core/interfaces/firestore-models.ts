export interface PortfolioDoc {
  id: string;
  title: string;
  description: string;
  category: string;
  img: string;
  imageSource: 'upload' | 'url';
  storagePath?: string;
  deleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PackageDoc {
  id: string;
  name: string;
  category: 'wedding' | 'portrait' | 'event' | 'commercial' | 'other';
  price: number;
  currency: string;
  features: string[];
  active: boolean;
  deleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDoc {
  email: string;
  role: 'super-admin' | 'admin' | 'employee';
  displayName: string;
  createdAt: Date;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  cta: string;
}

export interface AboutMeContent {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export interface ContactContent {
  title: string;
  subtitle: string;
  address: string;
  email: string;
  phone: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SocialLinksContent {
  links: SocialLink[];
}

export interface CategoryDoc {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export interface SettingsDoc {
  siteName: string;
  logoUrl: string;
  footerText: string;
}

export interface NavLinkDoc {
  id: string;
  label: string;
  path: string;
  order: number;
  visible: boolean;
}

export interface ThemeSettings {
  primaryColor: string;
  primaryHover: string;
  displayFont: string;
  bodyFont: string;
  borderRadius: string;
  darkModeDefault: boolean;
}

export interface PageSectionItem {
  id: string;
  visible: boolean;
  order: number;
}

export interface PageSectionsConfig {
  sections: PageSectionItem[];
}
