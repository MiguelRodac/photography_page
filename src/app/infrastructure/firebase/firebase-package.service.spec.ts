import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { FirebasePackageService } from './firebase-package.service';
import { PackageDoc } from '../../core/interfaces/firestore-models';

describe('FirebasePackageService', () => {
  let service: FirebasePackageService;
  let mockFirestore: any;

  const mockPackageDoc: PackageDoc = {
    id: 'pkg-1',
    name: 'Wedding Basic',
    category: 'wedding',
    price: 500,
    currency: 'USD',
    features: ['Feature 1', 'Feature 2'],
    active: true,
    deleted: false,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-02'),
  };

  beforeEach(() => {
    mockFirestore = {};

    TestBed.configureTestingModule({
      providers: [FirebasePackageService, { provide: Firestore, useValue: mockFirestore }],
    });

    service = TestBed.inject(FirebasePackageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return non-deleted packages from Firestore', (done) => {
      spyOn(service as any, 'createQuery').and.returnValue('mockQuery');
      spyOn(service as any, 'getCollectionData').and.returnValue(of([mockPackageDoc]));

      service.getAll().subscribe((items) => {
        expect(items).toEqual([mockPackageDoc]);
        expect((service as any).createQuery).toHaveBeenCalledWith('packages', jasmine.any(Object), jasmine.any(Object), jasmine.any(Object));
        done();
      });
    });

    it('should call getCollectionData with the query', (done) => {
      spyOn(service as any, 'createQuery').and.returnValue('mockQuery');
      const dataSpy = spyOn(service as any, 'getCollectionData').and.returnValue(of([mockPackageDoc]));

      service.getAll().subscribe(() => {
        expect(dataSpy).toHaveBeenCalledWith('mockQuery');
        done();
      });
    });
  });

  describe('getById', () => {
    it('should return a single package by id', (done) => {
      spyOn(service as any, 'createDocRef').and.returnValue('mockDocRef');
      spyOn(service as any, 'observeDocData').and.returnValue(of(mockPackageDoc));

      service.getById('pkg-1').subscribe((item) => {
        expect(item).toEqual(mockPackageDoc);
        expect((service as any).createDocRef).toHaveBeenCalledWith('packages/pkg-1');
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
    it('should add a new package document and return its id', async () => {
      spyOn(service as any, 'createCollectionRef').and.returnValue('mockColRef');
      spyOn(service as any, 'addDocument').and.returnValue(Promise.resolve('new-pkg-id'));

      const createData = {
        name: 'New Package',
        category: 'portrait' as const,
        price: 300,
        currency: 'USD',
        features: ['Feature A'],
        active: true,
      };

      const id = await service.create(createData);
      expect(id).toBe('new-pkg-id');
      expect((service as any).createCollectionRef).toHaveBeenCalledWith('packages');
    });

    it('should include deleted:false and timestamps in created document', async () => {
      spyOn(service as any, 'createCollectionRef').and.returnValue('mockColRef');
      const addSpy = spyOn(service as any, 'addDocument').and.returnValue(Promise.resolve('new-pkg-id'));

      const createData = {
        name: 'New Package',
        category: 'portrait' as const,
        price: 300,
        currency: 'USD',
        features: ['Feature A'],
        active: true,
      };

      await service.create(createData);
      const docData = addSpy.calls.first().args[1] as any;
      expect(docData.deleted).toBeFalse();
      expect(docData.createdAt).toBeDefined();
      expect(docData.updatedAt).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update the package document with new data', async () => {
      spyOn(service as any, 'createDocRef').and.returnValue('mockDocRef');
      const updateSpy = spyOn(service as any, 'updateDocument').and.returnValue(Promise.resolve());

      await service.update('pkg-1', { price: 600 });
      expect((service as any).createDocRef).toHaveBeenCalledWith('packages/pkg-1');
      expect(updateSpy).toHaveBeenCalled();
      expect((updateSpy.calls.first().args[1] as any).price).toBe(600);
      expect((updateSpy.calls.first().args[1] as any).updatedAt).toBeDefined();
    });
  });

  describe('deactivate', () => {
    it('should set active:false on the package', async () => {
      spyOn(service as any, 'createDocRef').and.returnValue('mockDocRef');
      const updateSpy = spyOn(service as any, 'updateDocument').and.returnValue(Promise.resolve());

      await service.deactivate('pkg-1');
      expect((service as any).createDocRef).toHaveBeenCalledWith('packages/pkg-1');
      expect((updateSpy.calls.first().args[1] as any).active).toBeFalse();
    });
  });
});
