import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/app/environments/environment';
import { ApiResponse } from 'src/app/models/api-response';
import { UsuarioDTO } from 'src/app/models/usuario-dto';
import { UsuarioUpdateDto } from 'src/app/models/usuario-update-dto';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  userForm: FormGroup;
  selectedFile: File | null = null;
  photoUrl: SafeUrl | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private autservice:AuthService

  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      photo: [null]
    });
  }

  ngOnInit() {
    this.fetchUserData();
  }

  fetchUserData() {
    this.userService.obtenerUsuario().subscribe(
      (data: UsuarioDTO) => {
        this.userForm.patchValue({
          username: data.username,
          email: data.email
        });
        if (data.photo) {
          const fullPhotoUrl = this.getFullPhotoUrl(data.photo);
          this.photoUrl = this.sanitizer.bypassSecurityTrustUrl(fullPhotoUrl);
        } else {
          this.photoUrl = null;
        }
      },
      (error) => {
        this.snackBar.open('Error al cargar los datos del usuario', 'Cerrar', { duration: 3000 });
      }
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
    this.userForm.patchValue({ photo: this.selectedFile });
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
   
      const usuarioUpdate: UsuarioUpdateDto = {
        Id: 0,
        username: this.userForm.get('username')?.value,
        email: this.userForm.get('email')?.value,
        photo: this.selectedFile || undefined  // Convierte null a undefined
      };

      this.userService.actualizarPerfil(usuarioUpdate).subscribe(
        (response: ApiResponse) => {
          this.snackBar.open('Perfil actualizado con éxito', 'Cerrar', { duration: 3000 });
        },
        (error) => {
          this.snackBar.open('Error al actualizar el perfil', 'Cerrar', { duration: 3000 });
        }
      );
    }
  }
  private getFullPhotoUrl(photoPath: string): string {
    // Remove '/api' from the environment.API_URL if it exists
    const baseUrl = environment.API_URL.endsWith('/api') 
      ? environment.API_URL.slice(0, -4) 
      : environment.API_URL;
    
    // Ensure photoPath starts with a slash
    const normalizedPhotoPath = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
    
    return `${baseUrl}${normalizedPhotoPath}`;
  }
}


