import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ContentAdminComponent } from './content-admin.component';
import { CONTENT_SERVICE } from '../../../core/tokens/content-service.token';
import { IContentService } from '../../../core/interfaces/content-service.interface';

describe('ContentAdminComponent', () => {
  let component: ContentAdminComponent;
  let fixture: ComponentFixture<ContentAdminComponent>;
  let mockContentService: jasmine.SpyObj<IContentService>;

  const mockHero = { title: 'Welcome', subtitle: 'Photography', cta: 'View Portfolio', bgImage: '' };

  beforeEach(async () => {
    mockContentService = jasmine.createSpyObj('IContentService', ['getSection', 'updateSection']);
    mockContentService.getSection.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [ContentAdminComponent],
      providers: [{ provide: CONTENT_SERVICE, useValue: mockContentService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentAdminComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Section list', () => {
    beforeEach(() => fixture.detectChanges());

    it('should have 7 sections matching site structure', () => {
      expect(component.sections.length).toBe(7);
    });

    it('should include hero, services, about, contact, header, footer, whatsapp', () => {
      const ids = component.sections.map((s) => s.id);
      expect(ids).toContain('hero');
      expect(ids).toContain('services');
      expect(ids).toContain('about');
      expect(ids).toContain('contact');
      expect(ids).toContain('header');
      expect(ids).toContain('footer');
      expect(ids).toContain('whatsapp');
    });

    it('should display section labels in template', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Home Hero');
      expect(compiled.textContent).toContain('About Me');
      expect(compiled.textContent).toContain('Contact');
      expect(compiled.textContent).toContain('WhatsApp');
    });
  });

  describe('Accordion behavior', () => {
    beforeEach(() => fixture.detectChanges());

    it('should start with no sections expanded', () => {
      expect(component.expandedSections().size).toBe(0);
    });

    it('should expand a section when clicked', () => {
      component.toggleSection('hero');
      expect(component.isExpanded('hero')).toBeTrue();
    });

    it('should collapse an expanded section when clicked again', () => {
      component.toggleSection('hero');
      component.toggleSection('hero');
      expect(component.isExpanded('hero')).toBeFalse();
    });

    it('should allow multiple sections to be expanded', () => {
      component.toggleSection('hero');
      component.toggleSection('about');
      expect(component.isExpanded('hero')).toBeTrue();
      expect(component.isExpanded('about')).toBeTrue();
    });

    it('should load section data when expanded', fakeAsync(() => {
      mockContentService.getSection.and.returnValue(of(mockHero));
      component.toggleSection('hero');
      tick();
      expect(mockContentService.getSection).toHaveBeenCalledWith('hero');
    }));
  });

  describe('Section forms', () => {
    beforeEach(() => fixture.detectChanges());

    it('should create a form for each section', () => {
      for (const section of component.sections) {
        expect(component.getForm(section.id)).toBeTruthy();
      }
    });

    it('should populate form when section data loads', fakeAsync(() => {
      mockContentService.getSection.and.returnValue(of(mockHero));
      component.toggleSection('hero');
      tick();

      const form = component.getForm('hero');
      expect(form?.controls['title'].value).toBe('Welcome');
      expect(form?.controls['subtitle'].value).toBe('Photography');
    }));

    it('should handle load error', fakeAsync(() => {
      mockContentService.getSection.and.returnValue(throwError(() => new Error('Network error')));
      component.toggleSection('hero');
      tick();

      expect(component.getSectionError('hero')).toBeTruthy();
    }));
  });

  describe('Save section', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      mockContentService.getSection.and.returnValue(of(mockHero));
      component.toggleSection('hero');
      tick();
      fixture.detectChanges();
    }));

    it('should save section data', fakeAsync(() => {
      mockContentService.updateSection.and.resolveTo();
      const form = component.getForm('hero');
      form?.controls['title'].setValue('Updated Title');

      component.saveSection('hero');
      tick();

      expect(mockContentService.updateSection).toHaveBeenCalledWith('hero', jasmine.objectContaining({ title: 'Updated Title' }));
    }));

    it('should show success after save', fakeAsync(() => {
      mockContentService.updateSection.and.resolveTo();
      component.saveSection('hero');
      tick();

      expect(component.isSuccess('hero')).toBeTrue();
    }));

    it('should show error on save failure', fakeAsync(() => {
      mockContentService.updateSection.and.rejectWith(new Error('Save failed'));
      component.saveSection('hero');
      tick();

      expect(component.getSectionError('hero')).toContain('Save failed');
    }));

    it('should track saving state', fakeAsync(() => {
      mockContentService.updateSection.and.resolveTo();
      component.saveSection('hero');
      expect(component.savingSection()).toBe('hero');
      tick();
      expect(component.savingSection()).toBeNull();
    }));
  });

  describe('Helper methods', () => {
    beforeEach(() => fixture.detectChanges());

    it('should identify JSON fields', () => {
      expect(component.isJsonField('services')).toBeTrue();
      expect(component.isJsonField('stats')).toBeTrue();
      expect(component.isJsonField('socialLinks')).toBeTrue();
      expect(component.isJsonField('title')).toBeFalse();
    });

    it('should format field names', () => {
      expect(component.formatFieldName('bgImage')).toBe('Bg Image');
      expect(component.formatFieldName('phoneNumber')).toBe('Phone Number');
    });

    it('should return correct input types', () => {
      expect(component.getInputType('logoUrl')).toBe('url');
      expect(component.getInputType('email')).toBe('email');
      expect(component.getInputType('phone')).toBe('tel');
      expect(component.getInputType('title')).toBe('text');
    });
  });
});
