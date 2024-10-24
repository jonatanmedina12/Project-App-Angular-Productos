import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ComponentHomeComponent } from './components/component-home/component-home.component';
import { RegisterComponent } from './components/register/register.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { authGuard } from './guards/auth.guard';
import { ProductsComponent } from './components/products/products.component';
import { ComponentMainComponent } from './components/main-layout/component-main/component-main.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { OrdersComponent } from './components/orders/orders.component';
import { PerfilComponent } from './components/main-layout/perfil/perfil.component';

const routes: Routes = [  {
  path: '',
  component: HomeComponent,
  children: [
    { path: '', component: ComponentHomeComponent },

    { path: 'login', component: LoginComponent },

    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: PasswordResetComponent },

  ]

},
{
  path: 'main',
  canActivate: [authGuard] ,
  component: MainLayoutComponent,
  children: [
    { path: '', component: ComponentMainComponent },

    { path: 'productos', component: ProductsComponent },
    { path: 'inventarios', component: InventoryComponent },
    { path: 'ordenes', component: OrdersComponent },
    { path: 'perfil', component: PerfilComponent },

  ]

},
{
  path: '**',
  canActivate: [authGuard],
  resolve: {
    redirectTo: 'redirectResolver'
  },
  component: LoginComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
