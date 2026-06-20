import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { NavigationAdminComponent } from './navigation-admin.component';
import { NAVIGATION_SERVICE } from '../../../core/tokens/navigation-service.token';
import { INavigationService } from '../../../core/interfaces/navigation-service.interface';
import { NavLinkDoc } from '../../../core/interfaces/firestore-models';

describe('NavigationAdminComponent', () => {
  let component: NavigationAdminComponent;
  let fixture: ComponentFixture<NavigationAdminComponent>;
  let mockService: jasmine.SpyObj<INavigationService>;

  const mockLinks: NavLinkDoc[] = [
    { id: 'nav-1', label: 'Home', path: '/', order: 1, visible: true },
    { id: 'nav-2', label: 'About', path: '/about-me', order: 2, visible: true },
    { id: 'nav-3', label: 'Portfolio', path: '/portfolio', order: 3, visible: false },
  ];

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('INavigationService', ['getAll', 'create', 'update', 'remove']);
    mockService.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [NavigationAdminComponent],
      providers: [{ provide: NAVIGATION_SERVICE, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationAdminComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Load links', () => {
    it('should load navigation links on init', fakeAsync(() => {
      mockService.getAll.and.returnValue(of(mockLinks));
      fixture.detectChanges();
      tick();

      expect(component.links()).toEqual(mockLinks);
      expect(component.loading()).toBeFalse();
    }));
  });

  describe('Create link', () => {
    beforeEach(fakeAsync(() => {
      mockService.getAll.and.returnValue(of(mockLinks));
      fixture.detectChanges();
      tick();
    }));

    it('should show form when add is clicked', () => {
      component.showAddForm();
      expect(component.showForm()).toBeTrue();
    });

    it('should create a new link', fakeAsync(() => {
      mockService.create.and.resolveTo('new-id');
      component.showAddForm();

      component.form.controls['label'].setValue('Contact');
      component.form.controls['path'].setValue('/contact');
      component.form.controls['order'].setValue(4);

      component.onSubmit();
      tick();

      expect(mockService.create).toHaveBeenCalledWith(jasmine.objectContaining({
        label: 'Contact',
        path: '/contact',
      }));
    }));
  });

  describe('Toggle visibility', () => {
    beforeEach(fakeAsync(() => {
      mockService.getAll.and.returnValue(of(mockLinks));
      fixture.detectChanges();
      tick();
    }));

    it('should toggle link visibility', fakeAsync(() => {
      mockService.update.and.resolveTo();
      component.toggleVisibility(mockLinks[0]);
      tick();

      expect(mockService.update).toHaveBeenCalledWith('nav-1', jasmine.objectContaining({
        visible: false,
      }));
    }));
  });

  describe('Delete link', () => {
    beforeEach(fakeAsync(() => {
      mockService.getAll.and.returnValue(of(mockLinks));
      fixture.detectChanges();
      tick();
    }));

    it('should delete link on confirm', fakeAsync(() => {
      mockService.remove.and.resolveTo();
      component.confirmDelete(mockLinks[0]);
      component.onConfirmDelete();
      tick();

      expect(mockService.remove).toHaveBeenCalledWith('nav-1');
    }));
  });

  describe('Rendering', () => {
    beforeEach(fakeAsync(() => {
      mockService.getAll.and.returnValue(of(mockLinks));
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }));

    it('should display link labels', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Home');
      expect(compiled.textContent).toContain('About');
    });

    it('should display link paths', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('/');
      expect(compiled.textContent).toContain('/about-me');
    });
  });
});
