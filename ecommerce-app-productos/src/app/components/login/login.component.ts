import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(300)),
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-10%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(-10%)', opacity: 0 }))
      ])
    ])
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.checkAuthStatus();
    this.checkExistingSession();
  }
  
  checkAuthStatus(): void {
    this.authService.isLoggedIn();
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.router.navigate(['/main']);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = '';
      this.authService.login(this.loginForm.value)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (result) => {

            if (result ) {
              this.loginError = 'Ya tienes una sesión activa. Por favor, cierra sesión antes de iniciar una nueva sesión.';
              console.log(this.loginError)
            } else {
              this.router.navigate(['/main']);
            }
          },
          error: (error: HttpErrorResponse) => {
            this.handleLoginError(error);
          }
        });
    }
  }

  checkExistingSession() {
    if (this.authService.isLoggedIn() || localStorage.getItem('session_active')) {
      this.router.navigate(['/main']);
    }
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
