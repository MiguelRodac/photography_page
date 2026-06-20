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
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { IPortfolioService, PortfolioCreate, PortfolioUpdate } from '../../core/interfaces/portfolio-service.interface';
import { PortfolioDoc } from '../../core/interfaces/firestore-models';

@Injectable({ providedIn: 'root' })
export class FirebasePortfolioService implements IPortfolioService {
  private readonly firestore = inject(Firestore);
  private readonly storage = inject(Storage);
  private readonly collectionName = 'portfolio';

  getAll(): Observable<PortfolioDoc[]> {
    const q = this.createQuery(this.collectionName, where('deleted', '==', false), orderBy('createdAt', 'desc'));
    return this.getCollectionData<PortfolioDoc[]>(q);
  }

  getById(id: string): Observable<PortfolioDoc | null> {
    const docRef = this.createDocRef(`${this.collectionName}/${id}`);
    return this.observeDocData<PortfolioDoc | null>(docRef);
  }

  async create(item: PortfolioCreate): Promise<string> {
    const colRef = this.createCollectionRef(this.collectionName);
    const now = new Date();
    const data = { ...item, deleted: false, createdAt: now, updatedAt: now };
    return this.addDocument(colRef, data);
  }

  async update(id: string, item: PortfolioUpdate): Promise<void> {
    const docRef = this.createDocRef(`${this.collectionName}/${id}`);
    await this.updateDocument(docRef, { ...item, updatedAt: new Date() });
  }

  async softDelete(id: string): Promise<void> {
    const docRef = this.createDocRef(`${this.collectionName}/${id}`);
    await this.updateDocument(docRef, { deleted: true, deletedAt: new Date() });
  }

  async uploadImage(file: File, onProgress?: (pct: number) => void): Promise<string> {
    const storagePath = `portfolio/${Date.now()}_${file.name}`;
    const storageRef = this.createStorageRef(storagePath);
    const uploadTask = this.createUploadTask(storageRef, file);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: any) => {
          if (onProgress) {
            const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            onProgress(pct);
          }
        },
        (error: any) => reject(error),
        async () => {
          const downloadURL = await this.getDownloadUrl(uploadTask.snapshot.ref);
          resolve(downloadURL);
        },
      );
    });
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

  protected createStorageRef(path: string): any {
    return ref(this.storage, path);
  }

  protected createUploadTask(storageRef: any, file: File): any {
    return uploadBytesResumable(storageRef, file);
  }

  protected async getDownloadUrl(storageRef: any): Promise<string> {
    return getDownloadURL(storageRef);
  }
}
