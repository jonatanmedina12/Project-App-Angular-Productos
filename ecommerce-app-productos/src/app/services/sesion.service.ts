import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable, switchMap, take, timer } from 'rxjs';
import { SesionExpiradaComponent } from '../components/sesion-expirada/sesion-expirada.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  private sessionTimeout: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private dialogRef: MatDialogRef<SesionExpiradaComponent> | null = null;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  startSessionTimer() {
    // Check the token every minute
    timer(0, 60000).pipe(
      switchMap(() => {
        console.log("Checking token expiration");
        return this.authService.isTokenExpired() ? 
          this.showSessionDialog() : 
          new Observable(subscriber => subscriber.complete());
      })
    ).subscribe();
  }

  private showSessionDialog(): Observable<any> {
    // Check if the dialog is already open
    if (this.dialogRef) {
      return new Observable(subscriber => subscriber.complete());
    }

    this.dialogRef = this.dialog.open(SesionExpiradaComponent, {
      width: '300px',
      disableClose: true,
      data: { message: 'Su sesión ha expirado. ¿Desea continuar?' }
    });

    return this.dialogRef.afterClosed().pipe(
      take(1),
      switchMap(result => {
        if (result) {
          return this.authService.refreshToken();
        } else { 
          this.authService.logout();
          return new Observable(subscriber => subscriber.complete());
        }
      })
    );
  }

  getSessionStatus(): Observable<boolean> {
    return this.sessionTimeout.asObservable();
  }
}
