import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SettingsAdminComponent } from './settings-admin.component';
import { CONTENT_SERVICE } from '../../../core/tokens/content-service.token';
import { IContentService } from '../../../core/interfaces/content-service.interface';

describe('SettingsAdminComponent', () => {
  let component: SettingsAdminComponent;
  let fixture: ComponentFixture<SettingsAdminComponent>;
  let mockContentService: jasmine.SpyObj<IContentService>;

  const mockSettings = {
    siteName: 'Photography ACAS',
    logoUrl: 'https://example.com/logo.png',
    footerText: '© 2026 Photography ACAS',
  };

  beforeEach(async () => {
    mockContentService = jasmine.createSpyObj('IContentService', ['getSection', 'updateSection']);
    mockContentService.getSection.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [SettingsAdminComponent],
      providers: [{ provide: CONTENT_SERVICE, useValue: mockContentService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsAdminComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Load settings', () => {
    it('should load settings on init', fakeAsync(() => {
      mockContentService.getSection.and.returnValue(of(mockSettings));
      fixture.detectChanges();
      tick();

      expect(mockContentService.getSection).toHaveBeenCalledWith('settings');
      expect(component.form.controls['siteName'].value).toBe('Photography ACAS');
      expect(component.form.controls['logoUrl'].value).toBe('https://example.com/logo.png');
      expect(component.form.controls['footerText'].value).toBe('© 2026 Photography ACAS');
    }));

    it('should handle load error', fakeAsync(() => {
      mockContentService.getSection.and.returnValue(throwError(() => new Error('Network error')));
      fixture.detectChanges();
      tick();

      expect(component.error()).toBeTruthy();
    }));
  });

  describe('Save settings', () => {
    beforeEach(fakeAsync(() => {
      mockContentService.getSection.and.returnValue(of(mockSettings));
      fixture.detectChanges();
      tick();
    }));

    it('should save settings', fakeAsync(() => {
      mockContentService.updateSection.and.resolveTo();

      component.form.controls['siteName'].setValue('New Site Name');
      component.save();
      tick();

      expect(mockContentService.updateSection).toHaveBeenCalledWith('settings', jasmine.objectContaining({
        siteName: 'New Site Name',
      }));
    }));

    it('should show success message after save', fakeAsync(() => {
      mockContentService.updateSection.and.resolveTo();
      component.form.controls['siteName'].setValue('Updated');
      component.save();
      tick();

      expect(component.successMessage()).toBeTruthy();
    }));

    it('should show error on save failure', fakeAsync(() => {
      mockContentService.updateSection.and.rejectWith(new Error('Save failed'));
      component.form.controls['siteName'].setValue('Updated');
      component.save();
      tick();

      expect(component.errorMessage()).toContain('Save failed');
    }));

    it('should show loading state during save', fakeAsync(() => {
      mockContentService.updateSection.and.resolveTo();
      component.form.controls['siteName'].setValue('Updated');

      component.save();
      expect(component.saving()).toBeTrue();
      tick();
      expect(component.saving()).toBeFalse();
    }));
  });

  describe('Rendering', () => {
    beforeEach(fakeAsync(() => {
      mockContentService.getSection.and.returnValue(of(mockSettings));
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }));

    it('should display settings form fields', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Site Name');
      expect(compiled.textContent).toContain('Logo URL');
      expect(compiled.textContent).toContain('Footer Text');
    });

    it('should have a save button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('button');
      const saveBtn = Array.from(buttons).find((b) => b.textContent?.includes('Save'));
      expect(saveBtn).toBeTruthy();
    });
  });
});
