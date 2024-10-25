import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sesion-expirada',
  templateUrl: './sesion-expirada.component.html',
  styleUrls: ['./sesion-expirada.component.css'],
  animations: [
    trigger('pulse', [
      state('void', style({
        transform: 'scale(1)',
        'box-shadow': 'none'
      })),
      transition('void => *', [
        animate('2s cubic-bezier(0.36, 0.07, 0.19, 0.97)', style({
          transform: 'scale(1.1)',
          'box-shadow': '0 0 15px rgba(63, 81, 181, 0.4)'
        }))
      ]),
      transition('* => void', [
        animate('2s cubic-bezier(0.36, 0.07, 0.19, 0.97)', style({
          transform: 'scale(1)',
          'box-shadow': 'none'
        }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SesionExpiradaComponent {
  constructor(
    public dialogRef: MatDialogRef<SesionExpiradaComponent>,private authService :AuthService,private router:Router,
    @Inject(MAT_DIALOG_DATA) public data: {message: string}
  ) {}
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    });
  }

  
  onNoClick(): void {
    this.dialogRef.close();
    this.logout();
  }
 
}
