import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IPackageService, PackageCreate, PackageUpdate } from '../../core/interfaces/package-service.interface';
import { PackageDoc } from '../../core/interfaces/firestore-models';

@Injectable({ providedIn: 'root' })
export class FirebasePackageService implements IPackageService {
  private readonly firestore = inject(Firestore);
  private readonly collectionName = 'packages';

  getAll(): Observable<PackageDoc[]> {
    const q = this.createQuery(
      this.collectionName,
      where('deleted', '==', false),
      orderBy('category', 'asc'),
      orderBy('price', 'asc'),
    );
    return this.getCollectionData<PackageDoc[]>(q);
  }

  getById(id: string): Observable<PackageDoc | null> {
    const docRef = this.createDocRef(`${this.collectionName}/${id}`);
    return this.observeDocData<PackageDoc | null>(docRef);
  }

  async create(pkg: PackageCreate): Promise<string> {
    const colRef = this.createCollectionRef(this.collectionName);
    const now = new Date();
    const data = { ...pkg, deleted: false, createdAt: now, updatedAt: now };
    return this.addDocument(colRef, data);
  }

  async update(id: string, pkg: PackageUpdate): Promise<void> {
    const docRef = this.createDocRef(`${this.collectionName}/${id}`);
    await this.updateDocument(docRef, { ...pkg, updatedAt: new Date() });
  }

  async deactivate(id: string): Promise<void> {
    const docRef = this.createDocRef(`${this.collectionName}/${id}`);
    await this.updateDocument(docRef, { active: false, updatedAt: new Date() });
  }

  // --- Protected wrappers for Firebase calls (testable) ---

  protected createCollectionRef(path: string): any {
    return collection(this.firestore, path);
  }

  protected createDocRef(path: string): any {
    return doc(this.firestore, path);
  }

  protected createQuery(path: string, ...constraints: any[]): any {
    const colRef = collection(this.firestore, path);
    return query(colRef, ...constraints);
  }

  protected getCollectionData<T>(queryRef: any): Observable<T> {
    return collectionData(queryRef, { idField: 'id' }) as Observable<T>;
  }

  protected observeDocData<T>(docRef: any): Observable<T> {
    return docData(docRef, { idField: 'id' as any }) as Observable<T>;
  }

  protected async addDocument(colRef: any, data: any): Promise<string> {
    const docRef = await addDoc(colRef, data);
    return docRef.id;
  }

  protected async updateDocument(docRef: any, data: any): Promise<void> {
    await updateDoc(docRef, data);
  }
}
