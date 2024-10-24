import { Component } from '@angular/core';
import { SesionService } from './services/sesion.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecommerce-app';
  constructor(
    private sessionService: SesionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log("aaaa")
    // Iniciar el temporizador de sesión solo si el usuario está logueado
    if (this.authService.isLoggedIn()) {
      this.sessionService.startSessionTimer();
    }

    // Suscribirse a cambios en el estado de autenticación
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.sessionService.startSessionTimer();
      }
    });
  }
}
