import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductsComponent } from './components/products/products.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { OrdersComponent } from './components/orders/orders.component';

import { SearchComponent } from './components/search/search.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ComponentHomeComponent } from './components/component-home/component-home.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { SidebarMainComponent } from './components/main-layout/sidebar-main/sidebar-main.component';
import { HeaderMainComponent } from './components/main-layout/header-main/header-main.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { SesionExpiradaComponent } from './components/sesion-expirada/sesion-expirada.component';
import { SesionService } from './services/sesion.service';
import { AuthService } from './services/auth.service';
import { ComponentMainComponent } from './components/main-layout/component-main/component-main.component';
import { MatChipsModule } from '@angular/material/chips';
import { PerfilComponent } from './components/main-layout/perfil/perfil.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProductsComponent,
    InventoryComponent,
    OrdersComponent,

    SearchComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ComponentHomeComponent,
    PasswordResetComponent,
    MainLayoutComponent,
    SidebarMainComponent,
    HeaderMainComponent,
    SesionExpiradaComponent,
    ComponentMainComponent,
    PerfilComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatChipsModule
  ],
  providers: [  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { 


  constructor(
    private sessionService: SesionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log("Contando contando")
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
