import { Component, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-header-main',
  templateUrl: './header-main.component.html',
  styleUrls: ['./header-main.component.css'],
  animations: [
    trigger('menuAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
      ])
    ])
  ]
})
export class HeaderMainComponent {
  @Output() sidenavToggle = new EventEmitter<void>();
  constructor(private authService: AuthService, private router: Router) {}
  loginError: string = '';

  toggleSidenav() {
    this.sidenavToggle.emit();
  }
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
        this.handleLoginError(error);
      }
    });
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
