import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IContentService } from '../../core/interfaces/content-service.interface';

@Injectable({ providedIn: 'root' })
export class FirebaseContentService implements IContentService {
  private readonly firestore = inject(Firestore);
  private readonly collectionName = 'content';

  getSection<T>(sectionId: string): Observable<T | null> {
    const docRef = this.createDocRef(`${this.collectionName}/${sectionId}`);
    return this.observeDocData<T>(docRef);
  }

  async updateSection<T>(sectionId: string, data: T): Promise<void> {
    const docRef = this.createDocRef(`${this.collectionName}/${sectionId}`);
    await this.writeDocData(docRef, data, { merge: true });
  }

  // --- Protected wrappers for Firebase calls (testable) ---

  protected createDocRef(path: string): any {
    return doc(this.firestore, path);
  }

  protected observeDocData<T>(docRef: any): Observable<T | null> {
    return docData(docRef) as Observable<T | null>;
  }

  protected async writeDocData(docRef: any, data: any, options?: any): Promise<void> {
    await setDoc(docRef, data, options);
  }
}
