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
import { INavigationService, NavLinkCreate, NavLinkUpdate } from '../../core/interfaces/navigation-service.interface';
import { NavLinkDoc } from '../../core/interfaces/firestore-models';

@Injectable({ providedIn: 'root' })
export class FirebaseNavigationService implements INavigationService {
  private readonly firestore = inject(Firestore);
  private readonly collectionName = 'navigation';

  getAll(): Observable<NavLinkDoc[]> {
    const q = this.createQuery(this.collectionName, orderBy('order', 'asc'));
    return this.getCollectionData<NavLinkDoc[]>(q);
  }

  async create(link: NavLinkCreate): Promise<string> {
    const colRef = this.createCollectionRef(this.collectionName);
    return this.addDocument(colRef, link);
  }

  async update(id: string, link: NavLinkUpdate): Promise<void> {
    const docRef = this.createDocRef(`${this.collectionName}/${id}`);
    await this.updateDocument(docRef, link);
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
