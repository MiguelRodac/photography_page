import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Rendering', () => {
    beforeEach(() => {
      component.title = 'Delete Item';
      component.message = 'Are you sure you want to delete this item?';
      fixture.detectChanges();
    });

    it('should display the title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Delete Item');
    });

    it('should display the message', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Are you sure you want to delete this item?');
    });

    it('should display default confirm and cancel text', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('button');
      const buttonTexts = Array.from(buttons).map((b) => b.textContent?.trim());

      expect(buttonTexts).toContain('Cancel');
      expect(buttonTexts).toContain('Confirm');
    });

    it('should display custom confirm and cancel text', () => {
      component.confirmText = 'Yes, delete';
      component.cancelText = 'No, keep';
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('button');
      const buttonTexts = Array.from(buttons).map((b) => b.textContent?.trim());

      expect(buttonTexts).toContain('No, keep');
      expect(buttonTexts).toContain('Yes, delete');
    });
  });

  describe('Events', () => {
    beforeEach(() => {
      component.title = 'Test';
      component.message = 'Test message';
      fixture.detectChanges();
    });

    it('should emit confirm event when confirm button clicked', () => {
      spyOn(component.confirm, 'emit');
      const compiled = fixture.nativeElement as HTMLElement;
      const confirmBtn = Array.from(compiled.querySelectorAll('button')).find(
        (b) => b.textContent?.trim() === 'Confirm'
      );
      confirmBtn?.click();
      expect(component.confirm.emit).toHaveBeenCalled();
    });

    it('should emit cancel event when cancel button clicked', () => {
      spyOn(component.cancel, 'emit');
      const compiled = fixture.nativeElement as HTMLElement;
      const cancelBtn = Array.from(compiled.querySelectorAll('button')).find(
        (b) => b.textContent?.trim() === 'Cancel'
      );
      cancelBtn?.click();
      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });
});
