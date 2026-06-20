import {
  PortfolioDoc,
  PackageDoc,
  UserDoc,
  HeroContent,
  AboutMeContent,
  ContactContent,
  SocialLinksContent,
} from './firestore-models';

describe('Firestore Document Models', () => {
  describe('PortfolioDoc', () => {
    it('should accept a valid document with all required fields', () => {
      const doc: PortfolioDoc = {
        id: 'abc123',
        title: 'Wedding Photos',
        description: 'Beautiful wedding day',
        category: 'wedding',
        img: 'https://example.com/photo.jpg',
        imageSource: 'url',
        deleted: false,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-02'),
      };

      expect(doc.id).toBe('abc123');
      expect(doc.imageSource).toBe('url');
      expect(doc.deleted).toBeFalse();
      expect(doc.storagePath).toBeUndefined();
      expect(doc.deletedAt).toBeUndefined();
    });

    it('should accept upload imageSource with storagePath', () => {
      const doc: PortfolioDoc = {
        id: 'def456',
        title: 'Portrait',
        description: 'Studio portrait',
        category: 'portrait',
        img: 'https://storage.example.com/photo.jpg',
        imageSource: 'upload',
        storagePath: 'portfolio/photo.jpg',
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(doc.imageSource).toBe('upload');
      expect(doc.storagePath).toBe('portfolio/photo.jpg');
    });

    it('should represent a soft-deleted document', () => {
      const doc: PortfolioDoc = {
        id: 'ghi789',
        title: 'Deleted Item',
        description: 'Soft deleted',
        category: 'event',
        img: 'url',
        imageSource: 'url',
        deleted: true,
        deletedAt: new Date('2026-06-01'),
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-06-01'),
      };

      expect(doc.deleted).toBeTrue();
      expect(doc.deletedAt).toEqual(new Date('2026-06-01'));
    });
  });

  describe('PackageDoc', () => {
    it('should accept a valid package with all category types', () => {
      const categories: Array<PackageDoc['category']> = ['wedding', 'portrait', 'event', 'commercial', 'other'];

      categories.forEach((category) => {
        const doc: PackageDoc = {
          id: 'pkg-' + category,
          name: category + ' Package',
          category,
          price: 500,
          currency: 'USD',
          features: ['Feature 1', 'Feature 2'],
          active: true,
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        expect(doc.category).toBe(category);
        expect(doc.active).toBeTrue();
        expect(doc.features).toHaveSize(2);
      });
    });

    it('should represent a deactivated package', () => {
      const doc: PackageDoc = {
        id: 'pkg-inactive',
        name: 'Old Package',
        category: 'wedding',
        price: 300,
        currency: 'ARS',
        features: [],
        active: false,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(doc.active).toBeFalse();
      expect(doc.deleted).toBeFalse();
    });
  });

  describe('UserDoc', () => {
    it('should accept all valid role types', () => {
      const roles: Array<UserDoc['role']> = ['super-admin', 'admin', 'employee'];

      roles.forEach((role) => {
        const doc: UserDoc = {
          email: role + '@example.com',
          role,
          displayName: role + ' User',
          createdAt: new Date(),
        };

        expect(doc.role).toBe(role);
        expect(doc.email).toContain(role);
      });
    });
  });

  describe('Content shapes', () => {
    it('should match HeroContent shape', () => {
      const content: HeroContent = {
        title: 'Welcome',
        subtitle: 'Photography ACAS',
        cta: 'View Portfolio',
      };

      expect(content.title).toBe('Welcome');
      expect(content.cta).toBe('View Portfolio');
    });

    it('should match AboutMeContent shape', () => {
      const content: AboutMeContent = {
        title: 'About Me',
        subtitle: 'The Photographer',
        description: 'Bio text',
        image: 'https://example.com/me.jpg',
      };

      expect(content.description).toBe('Bio text');
      expect(content.image).toContain('https://');
    });

    it('should match ContactContent shape', () => {
      const content: ContactContent = {
        title: 'Contact',
        subtitle: 'Get in touch',
        address: 'Buenos Aires, AR',
        email: 'hello@photographyacas.com',
        phone: '+5491157445478',
      };

      expect(content.address).toBe('Buenos Aires, AR');
      expect(content.phone).toContain('+54');
    });

    it('should match SocialLinksContent shape', () => {
      const content: SocialLinksContent = {
        links: [
          { platform: 'instagram', url: 'https://instagram.com/photo' },
          { platform: 'whatsapp', url: 'https://wa.me/5491157445478' },
        ],
      };

      expect(content.links).toHaveSize(2);
      expect(content.links[0].platform).toBe('instagram');
      expect(content.links[1].url).toContain('wa.me');
    });
  });
});
