import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AUTH_SERVICE } from '../tokens/auth-service.token';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AUTH_SERVICE);
  const router = inject(Router);

  return auth.authState$.pipe(
    take(1),
    map((user) => {
      if (!user) return router.createUrlTree(['/admin-page/login']);
      const requiredRole = route.data['requiredRole'] as string | undefined;
      if (requiredRole && !auth.hasRole(requiredRole)) {
        return router.createUrlTree(['/admin-page/unauthorized']);
      }
      return true;
    }),
  );
};
