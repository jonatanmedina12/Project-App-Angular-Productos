import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  @ViewChild('drawer') drawer!: MatSidenav;
  content: boolean = true;

  onToggleSidenav() {
    this.drawer.toggle();
  }
  scrollToHeader() {
    const header = document.getElementById('header');
    if (header) {
      header.scrollIntoView({ behavior: 'smooth' }); // Desplazamiento suave hacia el encabezado
    } else {
      console.error('Encabezado no encontrado');
    }
  }
  constructor(private router: Router,private authService: AuthService) {
    // Escucha los cambios de ruta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Define las rutas donde no quieres que aparezca el header
        const noHeaderRoutes = ['','/', '/login', '/register', '/forgot-password'];
        this.content = !noHeaderRoutes.includes(this.router.url);
      }
    });
  }
}
