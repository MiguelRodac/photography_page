import { Observable } from 'rxjs';
import { PortfolioDoc } from './firestore-models';

export type PortfolioCreate = Omit<PortfolioDoc, 'id' | 'deleted' | 'deletedAt' | 'createdAt' | 'updatedAt'>;
export type PortfolioUpdate = Partial<PortfolioCreate>;

export interface IPortfolioService {
  getAll(): Observable<PortfolioDoc[]>;
  getById(id: string): Observable<PortfolioDoc | null>;
  create(item: PortfolioCreate): Promise<string>;
  update(id: string, item: PortfolioUpdate): Promise<void>;
  softDelete(id: string): Promise<void>;
  uploadImage(file: File, onProgress?: (pct: number) => void): Promise<string>;
}
