import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PackagesAdminComponent } from './packages-admin.component';
import { PACKAGE_SERVICE } from '../../../core/tokens/package-service.token';
import { IPackageService } from '../../../core/interfaces/package-service.interface';
import { PackageDoc } from '../../../core/interfaces/firestore-models';

describe('PackagesAdminComponent', () => {
  let component: PackagesAdminComponent;
  let fixture: ComponentFixture<PackagesAdminComponent>;
  let mockPackageService: jasmine.SpyObj<IPackageService>;

  const mockPackages: PackageDoc[] = [
    {
      id: '1',
      name: 'Wedding Basic',
      category: 'wedding',
      price: 1200,
      currency: 'USD',
      features: ['4 hours coverage', '100 edited photos', 'Online gallery'],
      active: true,
      deleted: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Portrait Session',
      category: 'portrait',
      price: 350,
      currency: 'USD',
      features: ['1 hour session', '30 edited photos', 'Print release'],
      active: true,
      deleted: false,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: '3',
      name: 'Event Coverage',
      category: 'event',
      price: 800,
      currency: 'USD',
      features: ['6 hours coverage', '200 edited photos'],
      active: false,
      deleted: false,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
  ];

  beforeEach(async () => {
    mockPackageService = jasmine.createSpyObj('IPackageService', [
      'getAll',
      'getById',
      'create',
      'update',
      'deactivate',
    ]);

    mockPackageService.getAll.and.returnValue(of(mockPackages));

    await TestBed.configureTestingModule({
      imports: [PackagesAdminComponent],
      providers: [{ provide: PACKAGE_SERVICE, useValue: mockPackageService }],
    }).compileComponents();

    fixture = TestBed.createComponent(PackagesAdminComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('List rendering', () => {
    beforeEach(() => fixture.detectChanges());

    it('should display all packages', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('[data-testid="package-item"]');
      expect(rows.length).toBe(3);
    });

    it('should display package name and price', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Wedding Basic');
      expect(compiled.textContent).toContain('1200');
    });

    it('should display active status badge', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Active');
      expect(compiled.textContent).toContain('Inactive');
    });

    it('should display package features', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('4 hours coverage');
      expect(compiled.textContent).toContain('100 edited photos');
    });
  });

  describe('List states', () => {
    it('should display empty state when no packages exist', () => {
      mockPackageService.getAll.and.returnValue(of([]));
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('No packages yet');
    });

    it('should display loading state initially', () => {
      // Before detectChanges, loading should be true
      expect(component.loading()).toBeTrue();
    });

    it('should display error state on fetch failure', () => {
      mockPackageService.getAll.and.returnValue(throwError(() => new Error('Network error')));
      fixture.detectChanges();

      expect(component.error()).toBeTruthy();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Error loading');
    });
  });

  describe('Category filter', () => {
    beforeEach(() => fixture.detectChanges());

    it('should filter packages by category', () => {
      component.selectedCategory.set('wedding');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('[data-testid="package-item"]');
      expect(rows.length).toBe(1);
      expect(compiled.textContent).toContain('Wedding Basic');
      expect(compiled.textContent).not.toContain('Portrait Session');
    });

    it('should show all packages when no category selected', () => {
      component.selectedCategory.set('');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('[data-testid="package-item"]');
      expect(rows.length).toBe(3);
    });

    it('should extract unique categories from packages', () => {
      const categories = component.categories();
      expect(categories).toContain('wedding');
      expect(categories).toContain('portrait');
      expect(categories).toContain('event');
    });
  });

  describe('Create/Edit form', () => {
    beforeEach(() => fixture.detectChanges());

    it('should show form when Add New clicked', () => {
      component.showAddForm();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('form')).toBeTruthy();
    });

    it('should have required fields in form', () => {
      component.showAddForm();
      fixture.detectChanges();

      expect(component.form.controls['name']).toBeTruthy();
      expect(component.form.controls['category']).toBeTruthy();
      expect(component.form.controls['price']).toBeTruthy();
      expect(component.form.controls['currency']).toBeTruthy();
    });

    it('should validate required name', () => {
      component.showAddForm();
      fixture.detectChanges();

      component.form.controls['name'].setValue('');
      expect(component.form.controls['name'].valid).toBeFalse();
    });

    it('should validate name minimum length (3 chars)', () => {
      component.showAddForm();
      fixture.detectChanges();

      component.form.controls['name'].setValue('ab');
      expect(component.form.controls['name'].valid).toBeFalse();
    });

    it('should validate positive price', () => {
      component.showAddForm();
      fixture.detectChanges();

      component.form.controls['price'].setValue(-10);
      expect(component.form.controls['price'].valid).toBeFalse();
    });

    it('should pre-populate form when editing', () => {
      component.editPackage(mockPackages[0]);
      fixture.detectChanges();

      expect(component.form.controls['name'].value).toBe('Wedding Basic');
      expect(component.form.controls['category'].value).toBe('wedding');
      expect(component.form.controls['price'].value).toBe(1200);
    });

    it('should create new package on form submit', fakeAsync(() => {
      mockPackageService.create.and.resolveTo('new-id');
      component.showAddForm();
      fixture.detectChanges();

      component.form.controls['name'].setValue('New Package');
      component.form.controls['category'].setValue('portrait');
      component.form.controls['price'].setValue(500);
      component.form.controls['currency'].setValue('USD');

      component.onSubmit();
      tick();

      expect(mockPackageService.create).toHaveBeenCalled();
    }));

    it('should update existing package on form submit', fakeAsync(() => {
      mockPackageService.update.and.resolveTo();
      component.editPackage(mockPackages[0]);
      fixture.detectChanges();

      component.form.controls['price'].setValue(1500);
      component.onSubmit();
      tick();

      expect(mockPackageService.update).toHaveBeenCalledWith('1', jasmine.objectContaining({ price: 1500 }));
    }));

    it('should not submit if form is invalid', fakeAsync(() => {
      component.showAddForm();
      fixture.detectChanges();

      component.form.controls['name'].setValue('');
      component.onSubmit();
      tick();

      expect(mockPackageService.create).not.toHaveBeenCalled();
    }));
  });

  describe('Features list (dynamic add/remove)', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.showAddForm();
      fixture.detectChanges();
    });

    it('should start with empty features list', () => {
      expect(component.features.length).toBe(0);
    });

    it('should add a feature', () => {
      component.addFeature();
      expect(component.features.length).toBe(1);
    });

    it('should remove a feature', () => {
      component.addFeature();
      component.addFeature();
      expect(component.features.length).toBe(2);

      component.removeFeature(0);
      expect(component.features.length).toBe(1);
    });

    it('should include features in submitted data', fakeAsync(() => {
      mockPackageService.create.and.resolveTo('new-id');
      component.form.controls['name'].setValue('Test Package');
      component.form.controls['category'].setValue('wedding');
      component.form.controls['price'].setValue(1000);
      component.form.controls['currency'].setValue('USD');

      component.addFeature();
      component.features.at(0).setValue('Feature 1');
      component.addFeature();
      component.features.at(1).setValue('Feature 2');

      component.onSubmit();
      tick();

      expect(mockPackageService.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          features: ['Feature 1', 'Feature 2'],
        }),
      );
    }));

    it('should pre-populate features when editing', () => {
      component.editPackage(mockPackages[0]);
      fixture.detectChanges();

      expect(component.features.length).toBe(3);
      expect(component.features.at(0).value).toBe('4 hours coverage');
    });
  });

  describe('Activate/Deactivate', () => {
    beforeEach(() => fixture.detectChanges());

    it('should show confirm dialog when deactivate clicked', () => {
      component.confirmToggleActive(mockPackages[0]);
      fixture.detectChanges();

      expect(component.showToggleConfirm()).toBeTrue();
      expect(component.packageToToggle()).toBe(mockPackages[0]);
    });

    it('should call deactivate for active package', fakeAsync(() => {
      mockPackageService.deactivate.and.resolveTo();
      component.confirmToggleActive(mockPackages[0]); // active: true
      fixture.detectChanges();

      component.onConfirmToggle();
      tick();

      expect(mockPackageService.deactivate).toHaveBeenCalledWith('1');
    }));

    it('should call update with active:true for inactive package', fakeAsync(() => {
      mockPackageService.update.and.resolveTo();
      component.confirmToggleActive(mockPackages[2]); // active: false
      fixture.detectChanges();

      component.onConfirmToggle();
      tick();

      expect(mockPackageService.update).toHaveBeenCalledWith('3', jasmine.objectContaining({ active: true }));
    }));

    it('should hide dialog on cancel', () => {
      component.confirmToggleActive(mockPackages[0]);
      fixture.detectChanges();

      component.onCancelToggle();
      fixture.detectChanges();

      expect(component.showToggleConfirm()).toBeFalse();
      expect(component.packageToToggle()).toBeNull();
    });

    it('should hide dialog after successful toggle', fakeAsync(() => {
      mockPackageService.deactivate.and.resolveTo();
      component.confirmToggleActive(mockPackages[0]);
      fixture.detectChanges();

      component.onConfirmToggle();
      tick();

      expect(component.showToggleConfirm()).toBeFalse();
    }));
  });

  describe('Error handling', () => {
    beforeEach(() => fixture.detectChanges());

    it('should display error on create failure', fakeAsync(() => {
      mockPackageService.create.and.rejectWith(new Error('Create failed'));
      component.showAddForm();
      fixture.detectChanges();

      component.form.controls['name'].setValue('Test');
      component.form.controls['category'].setValue('wedding');
      component.form.controls['price'].setValue(100);
      component.form.controls['currency'].setValue('USD');

      component.onSubmit();
      tick();

      expect(component.errorMessage()).toContain('Create failed');
    }));

    it('should display error on deactivate failure', fakeAsync(() => {
      mockPackageService.deactivate.and.rejectWith(new Error('Deactivate failed'));
      component.confirmToggleActive(mockPackages[0]);
      fixture.detectChanges();

      component.onConfirmToggle();
      tick();

      expect(component.errorMessage()).toContain('Deactivate failed');
    }));
  });
});
