import { Observable } from 'rxjs';
import { CategoryDoc } from './firestore-models';

export type CategoryCreate = Omit<CategoryDoc, 'id'>;
export type CategoryUpdate = Partial<CategoryCreate>;

export interface ICategoriesService {
  getAll(): Observable<CategoryDoc[]>;
  create(category: CategoryCreate): Promise<string>;
  update(id: string, category: CategoryUpdate): Promise<void>;
  remove(id: string): Promise<void>;
}
