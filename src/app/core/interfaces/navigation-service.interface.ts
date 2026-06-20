import { Observable } from 'rxjs';
import { NavLinkDoc } from './firestore-models';

export type NavLinkCreate = Omit<NavLinkDoc, 'id'>;
export type NavLinkUpdate = Partial<NavLinkCreate>;

export interface INavigationService {
  getAll(): Observable<NavLinkDoc[]>;
  create(link: NavLinkCreate): Promise<string>;
  update(id: string, link: NavLinkUpdate): Promise<void>;
  remove(id: string): Promise<void>;
}
