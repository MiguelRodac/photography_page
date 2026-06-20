import { Observable } from 'rxjs';
import { PackageDoc } from './firestore-models';

export type PackageCreate = Omit<PackageDoc, 'id' | 'deleted' | 'deletedAt' | 'createdAt' | 'updatedAt'>;
export type PackageUpdate = Partial<PackageCreate>;

export interface IPackageService {
  getAll(): Observable<PackageDoc[]>;
  getById(id: string): Observable<PackageDoc | null>;
  create(pkg: PackageCreate): Promise<string>;
  update(id: string, pkg: PackageUpdate): Promise<void>;
  deactivate(id: string): Promise<void>;
}
