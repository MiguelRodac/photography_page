import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ContentAdminComponent } from './content-admin.component';
import { CONTENT_SERVICE } from '../../../core/tokens/content-service.token';
import { IContentService } from '../../../core/interfaces/content-service.interface';
import { HeroContent, AboutMeContent, ContactContent, SocialLinksContent } from '../../../core/interfaces/firestore-models';

describe('ContentAdminComponent', () => {
  let component: ContentAdminComponent;
  let fixture: ComponentFixture<ContentAdminComponent>;
  let mockContentService: jasmine.SpyObj<IContentService>;

  const mockHero: HeroContent = {
    title: 'Welcome',
    subtitle: 'Photography by Rodac',
    cta: 'View Portfolio',
  };

  const mockAbout: AboutMeContent = {
    title: 'About Me',
    subtitle: 'Professional Photographer',
    description: 'I capture moments',
    image: 'https://example.com/about.jpg',
  };

  beforeEach(async () => {
    mockContentService = jasmine.createSpyObj('IContentService', ['getSection', 'updateSection']);

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

    it('should display list of editable sections', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Hero');
      expect(compiled.textContent).toContain('About Me');
      expect(compiled.textContent).toContain('Contact');
      expect(compiled.textContent).toContain('Social Links');
    });

    it('should have at least 4 sections', () => {
      expect(component.sections.length).toBeGreaterThanOrEqual(4);
    });

    it('should select a section when clicked', () => {
      component.selectSection('hero');
      fixture.detectChanges();

      expect(component.selectedSection()).toBe('hero');
    });
  });

  describe('Editor rendering', () => {
    beforeEach(() => fixture.detectChanges());

    it('should load section data when selected', fakeAsync(() => {
      mockContentService.getSection.and.returnValue(of(mockHero));
      component.selectSection('hero');
      tick();

      expect(mockContentService.getSection).toHaveBeenCalledWith('hero');
    }));

    it('should populate form with section data', fakeAsync(() => {
      mockContentService.getSection.and.returnValue(of(mockHero));
      component.selectSection('hero');
      tick();
      fixture.detectChanges();

      expect(component.form.controls['title'].value).toBe('Welcome');
      expect(component.form.controls['subtitle'].value).toBe('Photography by Rodac');
    }));

    it('should show editor only when section is selected', () => {
      expect(component.selectedSection()).toBeNull();
      component.selectSection('hero');
      expect(component.selectedSection()).toBe('hero');
    });

    it('should display textarea for text fields', fakeAsync(() => {
      mockContentService.getSection.and.returnValue(of(mockHero));
      component.selectSection('hero');
      tick();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const textareas = compiled.querySelectorAll('textarea');
      expect(textareas.length).toBeGreaterThan(0);
    }));

    it('should show loading state while fetching section', () => {
      component.selectSection('hero');
      expect(component.loading()).toBeTrue();
    });

    it('should display error on fetch failure', fakeAsync(() => {
      mockContentService.getSection.and.returnValue(throwError(() => new Error('Network error')));
      component.selectSection('hero');
      tick();

      expect(component.error()).toBeTruthy();
    }));
  });

  describe('Preview mode', () => {
    beforeEach(() => fixture.detectChanges());

    it('should toggle preview mode', () => {
      expect(component.previewMode()).toBeFalse();
      component.togglePreview();
      expect(component.previewMode()).toBeTrue();
      component.togglePreview();
      expect(component.previewMode()).toBeFalse();
    });

    it('should show preview when preview mode is active', fakeAsync(() => {
      mockContentService.getSection.and.returnValue(of(mockHero));
      component.selectSection('hero');
      tick();
      fixture.detectChanges();

      component.togglePreview();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Welcome');
    }));
  });

  describe('Save', () => {
    beforeEach(() => fixture.detectChanges());

    it('should save section data', fakeAsync(() => {
      mockContentService.getSection.and.returnValue(of(mockHero));
      mockContentService.updateSection.and.resolveTo();

      component.selectSection('hero');
      tick();
      fixture.detectChanges();

      component.form.controls['title'].setValue('Updated Title');
      component.save();
      tick();

      expect(mockContentService.updateSection).toHaveBeenCalledWith('hero', jasmine.objectContaining({ title: 'Updated Title' }));
    }));

    it('should show loading state during save', fakeAsync(() => {
      mockContentService.getSection.and.returnValue(of(mockHero));
      mockContentService.updateSection.and.resolveTo();

      component.selectSection('hero');
      tick();
      fixture.detectChanges();

      expect(component.saving()).toBeFalse();
      component.save();
      expect(component.saving()).toBeTrue();
      tick();
      expect(component.saving()).toBeFalse();
    }));

    it('should show success message after save', fakeAsync(() => {
      mockContentService.getSection.and.returnValue(of(mockHero));
      mockContentService.updateSection.and.resolveTo();

      component.selectSection('hero');
      tick();
      fixture.detectChanges();

      component.save();
      tick();

      expect(component.successMessage()).toBeTruthy();
    }));

    it('should display error on save failure', fakeAsync(() => {
      mockContentService.getSection.and.returnValue(of(mockHero));
      mockContentService.updateSection.and.rejectWith(new Error('Save failed'));

      component.selectSection('hero');
      tick();
      fixture.detectChanges();

      component.save();
      tick();

      expect(component.errorMessage()).toContain('Save failed');
    }));

    it('should clear success message on new edit', fakeAsync(() => {
      mockContentService.getSection.and.returnValue(of(mockHero));
      mockContentService.updateSection.and.resolveTo();

      component.selectSection('hero');
      tick();
      fixture.detectChanges();

      component.save();
      tick();
      expect(component.successMessage()).toBeTruthy();

      component.form.controls['title'].setValue('New edit');
      expect(component.successMessage()).toBeNull();
    }));
  });

  describe('Discard changes', () => {
    beforeEach(() => fixture.detectChanges());

    it('should show discard confirmation when there are unsaved changes', fakeAsync(() => {
      mockContentService.getSection.and.returnValue(of(mockHero));
      component.selectSection('hero');
      tick();
      fixture.detectChanges();

      component.form.controls['title'].setValue('Changed');
      expect(component.hasUnsavedChanges()).toBeTrue();
    }));

    it('should show confirm dialog on discard', fakeAsync(() => {
      mockContentService.getSection.and.returnValue(of(mockHero));
      component.selectSection('hero');
      tick();
      fixture.detectChanges();

      component.form.controls['title'].setValue('Changed');
      component.discardChanges();
      fixture.detectChanges();

      expect(component.showDiscardConfirm()).toBeTrue();
    }));

    it('should reload original data on confirm discard', fakeAsync(() => {
      mockContentService.getSection.and.returnValue(of(mockHero));
      component.selectSection('hero');
      tick();
      fixture.detectChanges();

      component.form.controls['title'].setValue('Changed');
      component.discardChanges();
      fixture.detectChanges();

      component.onConfirmDiscard();
      tick();

      expect(component.form.controls['title'].value).toBe('Welcome');
      expect(component.showDiscardConfirm()).toBeFalse();
    }));

    it('should hide dialog on cancel discard', fakeAsync(() => {
      mockContentService.getSection.and.returnValue(of(mockHero));
      component.selectSection('hero');
      tick();
      fixture.detectChanges();

      component.form.controls['title'].setValue('Changed');
      component.discardChanges();
      fixture.detectChanges();

      component.onCancelDiscard();
      fixture.detectChanges();

      expect(component.showDiscardConfirm()).toBeFalse();
      expect(component.form.controls['title'].value).toBe('Changed');
    }));
  });

  describe('Loading states', () => {
    beforeEach(() => fixture.detectChanges());

    it('should not be loading initially', () => {
      expect(component.loading()).toBeFalse();
    });

    it('should set loading when fetching section', fakeAsync(() => {
      component.selectSection('hero');
      expect(component.loading()).toBeTrue();

      mockContentService.getSection.and.returnValue(of(mockHero));
      tick();

      expect(component.loading()).toBeFalse();
    }));
  });
});
