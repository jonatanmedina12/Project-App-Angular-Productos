import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar-main',
  templateUrl: './sidebar-main.component.html',
  styleUrls: ['./sidebar-main.component.css'],
  animations: [
    trigger('sidenavAnimation', [
      state('closed', style({
        width: '0px',
        visibility: 'hidden'
      })),
      state('open', style({
        width: '250px',
        visibility: 'visible'
      })),
      transition('closed <=> open', animate('300ms ease-in-out'))
    ])
  ]
})
export class SidebarMainComponent {
  @ViewChild('drawer') drawer!: MatSidenav;
  isOpen = true;
  currentRoute: string = '';
  loginError: string = '';
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
    });
    this.checkAdminStatus();

  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
        this.handleLoginError(error)
      }
    });
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
  checkAdminStatus() {
    this.isAdmin = this.authService.isAdmin();
  }
  isActive(route: string): boolean {
    if (route !== '/dashboard') {
      return this.currentRoute !== '/dashboard' ;
    }
    return this.currentRoute.startsWith(route);
  }
  private handleLoginError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.loginError = 'Credenciales inválidas. Por favor, intenta de nuevo.';
    } else if (error.error && error.error.message && error.error.message.includes('sesión activa')) {
      this.loginError = error.error.message;
    } else {
      this.loginError = 'Ocurrió un error durante el inicio de sesión. Por favor, intenta más tarde.';
    }
    console.error('Error de login', error);
  }
}
