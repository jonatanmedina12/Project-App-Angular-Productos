import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable, take } from 'rxjs';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser.pipe(
    take(1),
    map(user => {
      const isLoggedIn = !!user;
      if (isLoggedIn) {
        // Lista de rutas que requieren rol de administrador
        const adminRoutes = ['', ''];
        
        // Verificamos si la ruta actual es una subruta de main
        if (state.url.startsWith('/main/')) {
          const currentRoute = state.url.split('/')[2]; // Obtiene la subruta de main
          
          if (adminRoutes.includes(currentRoute)) {
            // Si la ruta requiere rol de administrador, verificamos si el usuario es admin
            if (authService.isAdmin()) {
              return true;
            } else {
              // Si no es admin, redirigimos a una página de acceso denegado
              return router.createUrlTree(['/main']); // O la ruta que prefieras para acceso denegado
            }
          }
        }
        
        // Si no es una ruta de admin o no está en dashboard, permitimos el acceso
        return true;
      }
      
      // Si no está logueado, redirigimos al login
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url }});
    })
  );
};