import { inject, Injectable } from '@angular/core';
import { CONTENT_SERVICE } from '../core/tokens/content-service.token';
import { IContentService } from '../core/interfaces/content-service.interface';
import { Observable, of, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class PublicContentCacheService {
  private readonly contentService = inject(CONTENT_SERVICE);
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  getSection<T>(sectionId: string): Observable<T | null> {
    const cacheKey = `content_${sectionId}`;
    const cached = this.getFromCache<T>(cacheKey);

    if (cached) {
      console.debug(`[ContentCache] ✅ Serving "${sectionId}" from cache`, cached);
      return of(cached);
    }

    console.debug(`[ContentCache] 🔍 Fetching "${sectionId}" from Firestore...`);
    return this.contentService.getSection<T>(sectionId).pipe(
      map((data) => {
        if (data) {
          console.debug(`[ContentCache] ✅ Got "${sectionId}" from Firestore`, data);
          this.saveToCache(cacheKey, data);
          return data;
        }
        console.warn(`[ContentCache] ⚠️ Firestore returned empty for "${sectionId}" — document may not exist`);
        return null;
      }),
      catchError((err) => {
        console.error(`[ContentCache] ❌ Failed to fetch "${sectionId}":`, err);
        return of(null);
      }),
    );
  }

  private getFromCache<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const entry: CacheEntry<T> = JSON.parse(raw);
      if (Date.now() - entry.timestamp > this.CACHE_TTL) {
        localStorage.removeItem(key);
        return null;
      }
      return entry.data;
    } catch {
      return null;
    }
  }

  private saveToCache<T>(key: string, data: T): void {
    try {
      const entry: CacheEntry<T> = { data, timestamp: Date.now() };
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (e) {
      console.warn('[ContentCache] Failed to save to cache:', e);
    }
  }
}
