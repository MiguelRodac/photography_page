import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';
import { FirebasePortfolioService } from './firebase-portfolio.service';
import { PortfolioDoc } from '../../core/interfaces/firestore-models';

describe('FirebasePortfolioService', () => {
  let service: FirebasePortfolioService;
  let mockFirestore: any;
  let mockStorage: any;

  const mockPortfolioDoc: PortfolioDoc = {
    id: 'doc-1',
    title: 'Wedding Photos',
    description: 'Beautiful wedding',
    category: 'wedding',
    img: 'https://example.com/photo.jpg',
    imageSource: 'url',
    deleted: false,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-02'),
  };

  beforeEach(() => {
    mockFirestore = {};
    mockStorage = {};

    TestBed.configureTestingModule({
      providers: [
        FirebasePortfolioService,
        { provide: Firestore, useValue: mockFirestore },
        { provide: Storage, useValue: mockStorage },
      ],
    });

    service = TestBed.inject(FirebasePortfolioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return non-deleted portfolio items from Firestore', (done) => {
      spyOn(service as any, 'createQuery').and.returnValue('mockQuery');
      spyOn(service as any, 'getCollectionData').and.returnValue(of([mockPortfolioDoc]));

      service.getAll().subscribe((items) => {
        expect(items).toEqual([mockPortfolioDoc]);
        expect((service as any).createQuery).toHaveBeenCalledWith(
          'portfolio',
          jasmine.objectContaining({ type: 'where' } as any),
          jasmine.objectContaining({ type: 'orderBy' } as any),
        );
        done();
      });
    });

    it('should call getCollectionData with the query', (done) => {
      spyOn(service as any, 'createQuery').and.returnValue('mockQuery');
      const dataSpy = spyOn(service as any, 'getCollectionData').and.returnValue(of([mockPortfolioDoc]));

      service.getAll().subscribe(() => {
        expect(dataSpy).toHaveBeenCalledWith('mockQuery');
        done();
      });
    });
  });

  describe('getById', () => {
    it('should return a single portfolio item by id', (done) => {
      spyOn(service as any, 'createDocRef').and.returnValue('mockDocRef');
      spyOn(service as any, 'observeDocData').and.returnValue(of(mockPortfolioDoc));

      service.getById('doc-1').subscribe((item) => {
        expect(item).toEqual(mockPortfolioDoc);
        expect((service as any).createDocRef).toHaveBeenCalledWith('portfolio/doc-1');
        done();
      });
    });

    it('should return null when document does not exist', (done) => {
      spyOn(service as any, 'createDocRef').and.returnValue('mockDocRef');
      spyOn(service as any, 'observeDocData').and.returnValue(of(null));

      service.getById('non-existent').subscribe((item) => {
        expect(item).toBeNull();
        done();
      });
    });
  });

  describe('create', () => {
    it('should add a new document to portfolio collection and return its id', async () => {
      spyOn(service as any, 'createCollectionRef').and.returnValue('mockColRef');
      spyOn(service as any, 'addDocument').and.returnValue(Promise.resolve('new-id'));

      const createData = {
        title: 'New Item',
        description: 'New description',
        category: 'portrait',
        img: 'https://example.com/new.jpg',
        imageSource: 'url' as const,
      };

      const id = await service.create(createData);
      expect(id).toBe('new-id');
      expect((service as any).createCollectionRef).toHaveBeenCalledWith('portfolio');
    });

    it('should include deleted:false and timestamps in created document', async () => {
      spyOn(service as any, 'createCollectionRef').and.returnValue('mockColRef');
      const addSpy = spyOn(service as any, 'addDocument').and.returnValue(Promise.resolve('new-id'));

      const createData = {
        title: 'New Item',
        description: 'New description',
        category: 'portrait',
        img: 'https://example.com/new.jpg',
        imageSource: 'url' as const,
      };

      await service.create(createData);
      const docData = addSpy.calls.first().args[1] as any;
      expect(docData.deleted).toBeFalse();
      expect(docData.createdAt).toBeDefined();
      expect(docData.updatedAt).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update the document with new data and updatedAt timestamp', async () => {
      spyOn(service as any, 'createDocRef').and.returnValue('mockDocRef');
      const updateSpy = spyOn(service as any, 'updateDocument').and.returnValue(Promise.resolve());

      await service.update('doc-1', { title: 'Updated Title' });
      expect((service as any).createDocRef).toHaveBeenCalledWith('portfolio/doc-1');
      expect(updateSpy).toHaveBeenCalled();
      const updateData = updateSpy.calls.first().args[1] as any;
      expect(updateData.title).toBe('Updated Title');
      expect(updateData.updatedAt).toBeDefined();
    });
  });

  describe('softDelete', () => {
    it('should set deleted:true and deletedAt timestamp', async () => {
      spyOn(service as any, 'createDocRef').and.returnValue('mockDocRef');
      const updateSpy = spyOn(service as any, 'updateDocument').and.returnValue(Promise.resolve());

      await service.softDelete('doc-1');
      expect((service as any).createDocRef).toHaveBeenCalledWith('portfolio/doc-1');
      const updateData = updateSpy.calls.first().args[1] as any;
      expect(updateData.deleted).toBeTrue();
      expect(updateData.deletedAt).toBeDefined();
    });
  });

  describe('uploadImage', () => {
    it('should upload file to storage and return download URL', async () => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      const mockUploadTask = {
        on: (_event: string, next: (snapshot: any) => void, _error: (err: any) => void, complete: () => void) => {
          next({ bytesTransferred: 50, totalBytes: 100 });
          next({ bytesTransferred: 100, totalBytes: 100 });
          complete();
          return () => {};
        },
        snapshot: { ref: 'uploadRef' },
      };

      spyOn(service as any, 'createStorageRef').and.returnValue('storageRef');
      spyOn(service as any, 'createUploadTask').and.returnValue(mockUploadTask);
      spyOn(service as any, 'getDownloadUrl').and.returnValue(Promise.resolve('https://storage.example.com/photo.jpg'));

      let progressValue = 0;
      const url = await service.uploadImage(mockFile, (pct) => (progressValue = pct));

      expect(url).toBe('https://storage.example.com/photo.jpg');
      expect((service as any).createStorageRef).toHaveBeenCalledWith(jasmine.stringMatching(/^portfolio\//));
      expect(progressValue).toBe(100);
    });
  });
});
