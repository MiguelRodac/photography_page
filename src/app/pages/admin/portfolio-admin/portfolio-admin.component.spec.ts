import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PortfolioAdminComponent } from './portfolio-admin.component';
import { PORTFOLIO_SERVICE } from '../../../core/tokens/portfolio-service.token';
import { IPortfolioService } from '../../../core/interfaces/portfolio-service.interface';
import { PortfolioDoc } from '../../../core/interfaces/firestore-models';

describe('PortfolioAdminComponent', () => {
  let component: PortfolioAdminComponent;
  let fixture: ComponentFixture<PortfolioAdminComponent>;
  let mockPortfolioService: jasmine.SpyObj<IPortfolioService>;

  const mockItems: PortfolioDoc[] = [
    {
      id: '1',
      title: 'Wedding Photos',
      description: 'Beautiful wedding shots',
      category: 'wedding',
      img: 'https://example.com/wedding.jpg',
      imageSource: 'url',
      deleted: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      title: 'Portrait Session',
      description: 'Studio portraits',
      category: 'portrait',
      img: 'https://example.com/portrait.jpg',
      imageSource: 'url',
      deleted: false,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: '3',
      title: 'Event Coverage',
      description: 'Corporate event',
      category: 'event',
      img: 'https://example.com/event.jpg',
      imageSource: 'url',
      deleted: false,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
  ];

  beforeEach(async () => {
    mockPortfolioService = jasmine.createSpyObj('IPortfolioService', [
      'getAll',
      'getById',
      'create',
      'update',
      'softDelete',
      'uploadImage',
    ]);

    mockPortfolioService.getAll.and.returnValue(of(mockItems));

    await TestBed.configureTestingModule({
      imports: [PortfolioAdminComponent],
      providers: [{ provide: PORTFOLIO_SERVICE, useValue: mockPortfolioService }],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioAdminComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('List rendering', () => {
    beforeEach(() => fixture.detectChanges());

    it('should display all portfolio items', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('[data-testid="portfolio-item"]');
      expect(rows.length).toBe(3);
    });

    it('should display item title and category', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Wedding Photos');
      expect(compiled.textContent).toContain('wedding');
    });

    it('should display item thumbnail', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const imgs = compiled.querySelectorAll('img');
      expect(imgs.length).toBeGreaterThan(0);
      expect(imgs[0].getAttribute('src')).toBe('https://example.com/wedding.jpg');
    });

    it('should display empty state when no items exist', () => {
      mockPortfolioService.getAll.and.returnValue(of([]));
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('No portfolio items yet');
    });

    it('should display loading state while fetching', () => {
      // Component starts in loading state before data arrives
      expect(component.loading()).toBeTrue();
    });

    it('should display error state on fetch failure', () => {
      mockPortfolioService.getAll.and.returnValue(throwError(() => new Error('Network error')));
      fixture.detectChanges();

      expect(component.error()).toBeTruthy();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Error loading');
    });
  });

  describe('Category filter', () => {
    beforeEach(() => fixture.detectChanges());

    it('should filter items by category', () => {
      component.selectedCategory.set('wedding');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('[data-testid="portfolio-item"]');
      expect(rows.length).toBe(1);
      expect(compiled.textContent).toContain('Wedding Photos');
      expect(compiled.textContent).not.toContain('Portrait Session');
    });

    it('should show all items when no category selected', () => {
      component.selectedCategory.set('');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('[data-testid="portfolio-item"]');
      expect(rows.length).toBe(3);
    });

    it('should extract unique categories from items', () => {
      const categories = component.categories();
      expect(categories).toContain('wedding');
      expect(categories).toContain('portrait');
      expect(categories).toContain('event');
    });
  });

  describe('Create/Edit form', () => {
    beforeEach(() => fixture.detectChanges());

    it('should show form when Add New clicked', () => {
      component.showForm.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('form')).toBeTruthy();
    });

    it('should have required fields in form', () => {
      component.showForm.set(true);
      fixture.detectChanges();

      expect(component.form.controls['title']).toBeTruthy();
      expect(component.form.controls['description']).toBeTruthy();
      expect(component.form.controls['category']).toBeTruthy();
      expect(component.form.controls['img']).toBeTruthy();
    });

    it('should validate required title', () => {
      component.showForm.set(true);
      fixture.detectChanges();

      component.form.controls['title'].setValue('');
      expect(component.form.controls['title'].valid).toBeFalse();
    });

    it('should pre-populate form when editing', () => {
      component.editItem(mockItems[0]);
      fixture.detectChanges();

      expect(component.form.controls['title'].value).toBe('Wedding Photos');
      expect(component.form.controls['description'].value).toBe('Beautiful wedding shots');
      expect(component.form.controls['category'].value).toBe('wedding');
    });

    it('should create new item on form submit', fakeAsync(() => {
      mockPortfolioService.create.and.resolveTo('new-id');
      component.showForm.set(true);
      fixture.detectChanges();

      component.form.controls['title'].setValue('New Item');
      component.form.controls['description'].setValue('Description');
      component.form.controls['category'].setValue('wedding');
      component.form.controls['img'].setValue('https://example.com/new.jpg');
      component.form.controls['imageSource'].setValue('url');

      component.onSubmit();
      tick();

      expect(mockPortfolioService.create).toHaveBeenCalled();
    }));

    it('should update existing item on form submit', fakeAsync(() => {
      mockPortfolioService.update.and.resolveTo();
      component.editItem(mockItems[0]);
      fixture.detectChanges();

      component.form.controls['title'].setValue('Updated Title');
      component.onSubmit();
      tick();

      expect(mockPortfolioService.update).toHaveBeenCalledWith('1', jasmine.objectContaining({ title: 'Updated Title' }));
    }));

    it('should not submit if form is invalid', fakeAsync(() => {
      component.showForm.set(true);
      fixture.detectChanges();

      component.form.controls['title'].setValue('');
      component.onSubmit();
      tick();

      expect(mockPortfolioService.create).not.toHaveBeenCalled();
    }));
  });

  describe('Delete confirmation', () => {
    beforeEach(() => fixture.detectChanges());

    it('should show confirm dialog when delete clicked', () => {
      component.confirmDelete(mockItems[0]);
      fixture.detectChanges();

      expect(component.showDeleteConfirm()).toBeTrue();
      expect(component.itemToDelete()).toBe(mockItems[0]);
    });

    it('should hide confirm dialog on cancel', () => {
      component.confirmDelete(mockItems[0]);
      fixture.detectChanges();

      component.onCancelDelete();
      fixture.detectChanges();

      expect(component.showDeleteConfirm()).toBeFalse();
      expect(component.itemToDelete()).toBeNull();
    });

    it('should soft delete item on confirm', fakeAsync(() => {
      mockPortfolioService.softDelete.and.resolveTo();
      component.confirmDelete(mockItems[0]);
      fixture.detectChanges();

      component.onConfirmDelete();
      tick();

      expect(mockPortfolioService.softDelete).toHaveBeenCalledWith('1');
    }));

    it('should hide dialog after successful delete', fakeAsync(() => {
      mockPortfolioService.softDelete.and.resolveTo();
      component.confirmDelete(mockItems[0]);
      fixture.detectChanges();

      component.onConfirmDelete();
      tick();

      expect(component.showDeleteConfirm()).toBeFalse();
    }));
  });

  describe('Image upload', () => {
    beforeEach(() => fixture.detectChanges());

    it('should handle file selection for upload', () => {
      component.showForm.set(true);
      fixture.detectChanges();

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      component.onFileSelected(file);

      expect(component.selectedFile()).toBe(file);
      expect(component.form.controls['imageSource'].value).toBe('upload');
    });

    it('should upload image and get URL', fakeAsync(() => {
      mockPortfolioService.uploadImage.and.resolveTo('https://storage.example.com/uploaded.jpg');
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      component.onFileSelected(file);
      fixture.detectChanges();

      component.uploadImage();
      tick();

      expect(mockPortfolioService.uploadImage).toHaveBeenCalledWith(file, jasmine.any(Function));
      expect(component.form.controls['img'].value).toBe('https://storage.example.com/uploaded.jpg');
    }));

    it('should track upload progress', fakeAsync(() => {
      let progressCallback: ((pct: number) => void) | undefined;
      mockPortfolioService.uploadImage.and.callFake((file, onProgress) => {
        progressCallback = onProgress;
        if (onProgress) onProgress(50);
        return Promise.resolve('https://storage.example.com/uploaded.jpg');
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      component.onFileSelected(file);
      component.uploadImage();
      tick();

      expect(component.uploadProgress()).toBe(50);
    }));

    it('should handle external URL input', () => {
      component.showForm.set(true);
      fixture.detectChanges();

      component.form.controls['imageSource'].setValue('url');
      component.form.controls['img'].setValue('https://example.com/external.jpg');

      expect(component.form.controls['imageSource'].value).toBe('url');
      expect(component.form.controls['img'].value).toBe('https://example.com/external.jpg');
    });
  });

  describe('Error handling', () => {
    beforeEach(() => fixture.detectChanges());

    it('should display error on create failure', fakeAsync(() => {
      mockPortfolioService.create.and.rejectWith(new Error('Create failed'));
      component.showForm.set(true);
      fixture.detectChanges();

      component.form.controls['title'].setValue('Test');
      component.form.controls['description'].setValue('Desc');
      component.form.controls['category'].setValue('wedding');
      component.form.controls['img'].setValue('https://example.com/test.jpg');
      component.form.controls['imageSource'].setValue('url');

      component.onSubmit();
      tick();

      expect(component.errorMessage()).toContain('Create failed');
    }));

    it('should display error on delete failure', fakeAsync(() => {
      mockPortfolioService.softDelete.and.rejectWith(new Error('Delete failed'));
      component.confirmDelete(mockItems[0]);
      fixture.detectChanges();

      component.onConfirmDelete();
      tick();

      expect(component.errorMessage()).toContain('Delete failed');
    }));
  });
});
