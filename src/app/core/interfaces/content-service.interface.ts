import { Observable } from 'rxjs';

export interface IContentService {
  getSection<T>(sectionId: string): Observable<T | null>;
  updateSection<T>(sectionId: string, data: T): Promise<void>;
}
