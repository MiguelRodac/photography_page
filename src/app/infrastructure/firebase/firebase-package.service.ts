import { Injectable, inject, NgZone } from '@angular/core';
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
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPackageService, PackageCreate, PackageUpdate } from '../../core/interfaces/package-service.interface';
import { PackageDoc } from '../../core/interfaces/firestore-models';

@Injectable({ providedIn: 'root' })
export class FirebasePackageService implements IPackageService {
  private readonly firestore = inject(Firestore);
  private readonly zone = inject(NgZone);
  private readonly collectionName = 'packages';

  getAll(): Observable<PackageDoc[]> {
    const q = this.createQuery(this.collectionName, where('deleted', '==', false));
    return this.getCollectionData<PackageDoc[]>(q).pipe(
      map((pkgs) =>
        pkgs.sort((a, b) => {
          const catCmp = (a.category || '').localeCompare(b.category || '');
          if (catCmp !== 0) return catCmp;
          return (a.price || 0) - (b.price || 0);
        }),
      ),
    );
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
    return new Observable<T>((subscriber) => {
      const sub = (collectionData(queryRef, { idField: 'id' }) as Observable<T>).subscribe({
        next: (val) => this.zone.run(() => subscriber.next(val)),
        error: (err) => this.zone.run(() => subscriber.error(err)),
        complete: () => this.zone.run(() => subscriber.complete()),
      });
      return () => sub.unsubscribe();
    });
  }

  protected observeDocData<T>(docRef: any): Observable<T> {
    return new Observable<T>((subscriber) => {
      const sub = (docData(docRef, { idField: 'id' as any }) as Observable<T>).subscribe({
        next: (val) => this.zone.run(() => subscriber.next(val)),
        error: (err) => this.zone.run(() => subscriber.error(err)),
        complete: () => this.zone.run(() => subscriber.complete()),
      });
      return () => sub.unsubscribe();
    });
  }

  protected async addDocument(colRef: any, data: any): Promise<string> {
    const docRef = await addDoc(colRef, data);
    return docRef.id;
  }

  protected async updateDocument(docRef: any, data: any): Promise<void> {
    await updateDoc(docRef, data);
  }
}
