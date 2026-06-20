import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { FirebaseNavigationService } from './firebase-navigation.service';
import { NavLinkDoc } from '../../core/interfaces/firestore-models';

describe('FirebaseNavigationService', () => {
  let service: FirebaseNavigationService;
  let mockFirestore: any;

  const mockLinks: NavLinkDoc[] = [
    { id: 'nav-1', label: 'Home', path: '/', order: 1, visible: true },
    { id: 'nav-2', label: 'About', path: '/about', order: 2, visible: true },
  ];

  beforeEach(() => {
    mockFirestore = {};

    TestBed.configureTestingModule({
      providers: [FirebaseNavigationService, { provide: Firestore, useValue: mockFirestore }],
    });

    service = TestBed.inject(FirebaseNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return navigation links ordered by order field', (done) => {
      spyOn(service as any, 'createQuery').and.returnValue('mockQuery');
      spyOn(service as any, 'getCollectionData').and.returnValue(of(mockLinks));

      service.getAll().subscribe((data) => {
        expect(data).toEqual(mockLinks);
        expect(data.length).toBe(2);
        done();
      });
    });
  });

  describe('create', () => {
    it('should add a new nav link and return its id', async () => {
      spyOn(service as any, 'createCollectionRef').and.returnValue('mockColRef');
      spyOn(service as any, 'addDocument').and.returnValue(Promise.resolve('new-nav-id'));

      const newLink = { label: 'Contact', path: '/contact', order: 3, visible: true };
      const id = await service.create(newLink);

      expect(id).toBe('new-nav-id');
    });
  });

  describe('update', () => {
    it('should update an existing nav link', async () => {
      spyOn(service as any, 'createDocRef').and.returnValue('mockDocRef');
      const updateSpy = spyOn(service as any, 'updateDocument').and.returnValue(Promise.resolve());

      await service.update('nav-1', { label: 'Inicio' });

      expect((service as any).createDocRef).toHaveBeenCalledWith('navigation/nav-1');
      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a nav link document', async () => {
      spyOn(service as any, 'createDocRef').and.returnValue('mockDocRef');
      const deleteSpy = spyOn(service as any, 'deleteDocument').and.returnValue(Promise.resolve());

      await service.remove('nav-1');

      expect(deleteSpy).toHaveBeenCalledWith('mockDocRef');
    });
  });
});
