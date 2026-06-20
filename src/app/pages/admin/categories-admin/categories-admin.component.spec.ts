import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CategoriesAdminComponent } from './categories-admin.component';
import { CATEGORIES_SERVICE } from '../../../core/tokens/categories-service.token';
import { ICategoriesService } from '../../../core/interfaces/categories-service.interface';
import { CategoryDoc } from '../../../core/interfaces/firestore-models';

describe('CategoriesAdminComponent', () => {
  let component: CategoriesAdminComponent;
  let fixture: ComponentFixture<CategoriesAdminComponent>;
  let mockService: jasmine.SpyObj<ICategoriesService>;

  const mockCategories: CategoryDoc[] = [
    { id: 'cat-1', name: 'Weddings', slug: 'weddings', order: 1 },
    { id: 'cat-2', name: 'Portraits', slug: 'portraits', order: 2 },
  ];

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('ICategoriesService', ['getAll', 'create', 'update', 'remove']);
    mockService.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [CategoriesAdminComponent],
      providers: [{ provide: CATEGORIES_SERVICE, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesAdminComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Load categories', () => {
    it('should load categories on init', fakeAsync(() => {
      mockService.getAll.and.returnValue(of(mockCategories));
      fixture.detectChanges();
      tick();

      expect(component.categories()).toEqual(mockCategories);
      expect(component.loading()).toBeFalse();
    }));

    it('should show loading state initially', () => {
      mockService.getAll.and.returnValue(of([]));
      expect(component.loading()).toBeTrue();
    });

    it('should handle load error', fakeAsync(() => {
      mockService.getAll.and.returnValue(throwError(() => new Error('Network error')));
      fixture.detectChanges();
      tick();

      expect(component.error()).toBeTruthy();
    }));
  });

  describe('Create category', () => {
    beforeEach(fakeAsync(() => {
      mockService.getAll.and.returnValue(of(mockCategories));
      fixture.detectChanges();
      tick();
    }));

    it('should show form when add is clicked', () => {
      component.showAddForm();
      expect(component.showForm()).toBeTrue();
      expect(component.editingId()).toBeNull();
    });

    it('should create a new category', fakeAsync(() => {
      mockService.create.and.resolveTo('new-id');
      component.showAddForm();

      component.form.controls['name'].setValue('Landscapes');
      component.form.controls['slug'].setValue('landscapes');
      component.form.controls['order'].setValue(3);

      component.onSubmit();
      tick();

      expect(mockService.create).toHaveBeenCalledWith({
        name: 'Landscapes',
        slug: 'landscapes',
        order: 3,
      });
    }));

    it('should not create if form is invalid', fakeAsync(() => {
      component.showAddForm();
      component.onSubmit();
      tick();

      expect(mockService.create).not.toHaveBeenCalled();
    }));
  });

  describe('Edit category', () => {
    beforeEach(fakeAsync(() => {
      mockService.getAll.and.returnValue(of(mockCategories));
      fixture.detectChanges();
      tick();
    }));

    it('should populate form with category data', () => {
      component.editItem(mockCategories[0]);
      expect(component.editingId()).toBe('cat-1');
      expect(component.form.controls['name'].value).toBe('Weddings');
      expect(component.form.controls['slug'].value).toBe('weddings');
    });

    it('should update an existing category', fakeAsync(() => {
      mockService.update.and.resolveTo();
      component.editItem(mockCategories[0]);

      component.form.controls['name'].setValue('Wedding Photography');
      component.onSubmit();
      tick();

      expect(mockService.update).toHaveBeenCalledWith('cat-1', jasmine.objectContaining({
        name: 'Wedding Photography',
      }));
    }));
  });

  describe('Delete category', () => {
    beforeEach(fakeAsync(() => {
      mockService.getAll.and.returnValue(of(mockCategories));
      fixture.detectChanges();
      tick();
    }));

    it('should show confirm dialog on delete', () => {
      component.confirmDelete(mockCategories[0]);
      expect(component.showDeleteConfirm()).toBeTrue();
      expect(component.itemToDelete()).toEqual(mockCategories[0]);
    });

    it('should delete category on confirm', fakeAsync(() => {
      mockService.remove.and.resolveTo();
      component.confirmDelete(mockCategories[0]);

      component.onConfirmDelete();
      tick();

      expect(mockService.remove).toHaveBeenCalledWith('cat-1');
      expect(component.showDeleteConfirm()).toBeFalse();
    }));

    it('should cancel delete', () => {
      component.confirmDelete(mockCategories[0]);
      component.onCancelDelete();

      expect(component.showDeleteConfirm()).toBeFalse();
      expect(component.itemToDelete()).toBeNull();
    });
  });

  describe('Rendering', () => {
    beforeEach(fakeAsync(() => {
      mockService.getAll.and.returnValue(of(mockCategories));
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }));

    it('should display category names', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Weddings');
      expect(compiled.textContent).toContain('Portraits');
    });

    it('should display category slugs', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('weddings');
      expect(compiled.textContent).toContain('portraits');
    });
  });
});
