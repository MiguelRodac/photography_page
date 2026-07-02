import { inject, Injectable } from '@angular/core';
import { CONTENT_SERVICE } from '../core/tokens/content-service.token';
import { IContentService } from '../core/interfaces/content-service.interface';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PublicContentCacheService {
  private readonly contentService = inject(CONTENT_SERVICE);

  getSection<T>(sectionId: string): Observable<T | null> {
    return this.contentService.getSection<T>(sectionId).pipe(
      map((data) => data || null),
      catchError(() => of(null)),
    );
  }
}
