import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ICategoriesService, CategoryCreate, CategoryUpdate } from '../../core/interfaces/categories-service.interface';
import { CategoryDoc } from '../../core/interfaces/firestore-models';

@Injectable({ providedIn: 'root' })
export class FirebaseCategoriesService implements ICategoriesService {
  private readonly firestore = inject(Firestore);
  private readonly collectionName = 'categories';

  getAll(): Observable<CategoryDoc[]> {
    const q = this.createQuery(this.collectionName, orderBy('order', 'asc'));
    return this.getCollectionData<CategoryDoc[]>(q);
  }

  async create(category: CategoryCreate): Promise<string> {
    const colRef = this.createCollectionRef(this.collectionName);
    return this.addDocument(colRef, category);
  }

  async update(id: string, category: CategoryUpdate): Promise<void> {
    const docRef = this.createDocRef(`${this.collectionName}/${id}`);
    await this.updateDocument(docRef, category);
  }

  async remove(id: string): Promise<void> {
    const docRef = this.createDocRef(`${this.collectionName}/${id}`);
    await this.deleteDocument(docRef);
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

  protected async addDocument(colRef: any, data: any): Promise<string> {
    const docRef = await addDoc(colRef, data);
    return docRef.id;
  }

  protected async updateDocument(docRef: any, data: any): Promise<void> {
    await updateDoc(docRef, data);
  }

  protected async deleteDocument(docRef: any): Promise<void> {
    await deleteDoc(docRef);
  }
}
