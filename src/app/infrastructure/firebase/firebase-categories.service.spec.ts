import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { FirebaseCategoriesService } from './firebase-categories.service';
import { CategoryDoc } from '../../core/interfaces/firestore-models';

describe('FirebaseCategoriesService', () => {
  let service: FirebaseCategoriesService;
  let mockFirestore: any;

  const mockCategories: CategoryDoc[] = [
    { id: 'cat-1', name: 'Weddings', slug: 'weddings', order: 1 },
    { id: 'cat-2', name: 'Portraits', slug: 'portraits', order: 2 },
    { id: 'cat-3', name: 'Events', slug: 'events', order: 3 },
  ];

  beforeEach(() => {
    mockFirestore = {};

    TestBed.configureTestingModule({
      providers: [FirebaseCategoriesService, { provide: Firestore, useValue: mockFirestore }],
    });

    service = TestBed.inject(FirebaseCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return categories ordered by order field', (done) => {
      spyOn(service as any, 'createQuery').and.returnValue('mockQuery');
      spyOn(service as any, 'getCollectionData').and.returnValue(of(mockCategories));

      service.getAll().subscribe((data) => {
        expect(data).toEqual(mockCategories);
        expect(data.length).toBe(3);
        expect((service as any).createQuery).toHaveBeenCalled();
        done();
      });
    });

    it('should return empty array when no categories exist', (done) => {
      spyOn(service as any, 'createQuery').and.returnValue('mockQuery');
      spyOn(service as any, 'getCollectionData').and.returnValue(of([]));

      service.getAll().subscribe((data) => {
        expect(data).toEqual([]);
        done();
      });
    });
  });

  describe('create', () => {
    it('should add a new category and return its id', async () => {
      spyOn(service as any, 'createCollectionRef').and.returnValue('mockColRef');
      spyOn(service as any, 'addDocument').and.returnValue(Promise.resolve('new-cat-id'));

      const newCat = { name: 'Landscapes', slug: 'landscapes', order: 4 };
      const id = await service.create(newCat);

      expect(id).toBe('new-cat-id');
      expect((service as any).addDocument).toHaveBeenCalledWith('mockColRef', jasmine.objectContaining({
        name: 'Landscapes',
        slug: 'landscapes',
        order: 4,
      }));
    });
  });

  describe('update', () => {
    it('should update an existing category', async () => {
      spyOn(service as any, 'createDocRef').and.returnValue('mockDocRef');
      const updateSpy = spyOn(service as any, 'updateDocument').and.returnValue(Promise.resolve());

      await service.update('cat-1', { name: 'Wedding Photography' });

      expect((service as any).createDocRef).toHaveBeenCalledWith('categories/cat-1');
      expect(updateSpy).toHaveBeenCalledWith('mockDocRef', jasmine.objectContaining({
        name: 'Wedding Photography',
      }));
    });
  });

  describe('remove', () => {
    it('should delete a category document', async () => {
      spyOn(service as any, 'createDocRef').and.returnValue('mockDocRef');
      const deleteSpy = spyOn(service as any, 'deleteDocument').and.returnValue(Promise.resolve());

      await service.remove('cat-1');

      expect((service as any).createDocRef).toHaveBeenCalledWith('categories/cat-1');
      expect(deleteSpy).toHaveBeenCalledWith('mockDocRef');
    });
  });
});
