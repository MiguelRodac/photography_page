import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { FirebaseContentService } from './firebase-content.service';

describe('FirebaseContentService', () => {
  let service: FirebaseContentService;
  let mockFirestore: any;

  const mockHeroContent = { title: 'Welcome', subtitle: 'Photography ACAS', cta: 'View Portfolio' };

  beforeEach(() => {
    mockFirestore = {};

    TestBed.configureTestingModule({
      providers: [FirebaseContentService, { provide: Firestore, useValue: mockFirestore }],
    });

    service = TestBed.inject(FirebaseContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSection', () => {
    it('should return content for the given section id', (done) => {
      spyOn(service as any, 'createDocRef').and.returnValue('mockDocRef');
      spyOn(service as any, 'observeDocData').and.returnValue(of(mockHeroContent));

      service.getSection('hero').subscribe((data: any) => {
        expect(data).toEqual(mockHeroContent);
        expect((service as any).createDocRef).toHaveBeenCalledWith('content/hero');
        done();
      });
    });

    it('should return null when section does not exist', (done) => {
      spyOn(service as any, 'createDocRef').and.returnValue('mockDocRef');
      spyOn(service as any, 'observeDocData').and.returnValue(of(null));

      service.getSection('nonexistent').subscribe((data) => {
        expect(data).toBeNull();
        done();
      });
    });

    it('should query different section ids correctly', (done) => {
      const aboutContent = { title: 'About', subtitle: 'Me', description: 'Bio', image: 'url' };
      spyOn(service as any, 'createDocRef').and.returnValue('mockDocRef');
      spyOn(service as any, 'observeDocData').and.returnValue(of(aboutContent));

      service.getSection('aboutMe').subscribe((data: any) => {
        expect(data).toEqual(aboutContent);
        expect((service as any).createDocRef).toHaveBeenCalledWith('content/aboutMe');
        done();
      });
    });
  });

  describe('updateSection', () => {
    it('should write data to the content section document', async () => {
      spyOn(service as any, 'createDocRef').and.returnValue('mockDocRef');
      const writeSpy = spyOn(service as any, 'writeDocData').and.returnValue(Promise.resolve());

      const newContent = { title: 'New Title', subtitle: 'New Sub', cta: 'New CTA' };
      await service.updateSection('hero', newContent);

      expect((service as any).createDocRef).toHaveBeenCalledWith('content/hero');
      expect(writeSpy).toHaveBeenCalled();
      expect(writeSpy.calls.first().args[1]).toEqual(newContent);
    });

    it('should use merge strategy to preserve existing fields', async () => {
      spyOn(service as any, 'createDocRef').and.returnValue('mockDocRef');
      const writeSpy = spyOn(service as any, 'writeDocData').and.returnValue(Promise.resolve());

      await service.updateSection('hero', { title: 'Updated' });
      expect(writeSpy.calls.first().args[2]).toEqual({ merge: true });
    });
  });
});
