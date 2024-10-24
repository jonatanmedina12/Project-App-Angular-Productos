import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent {
  forgotPasswordForm: FormGroup = new FormGroup({});
  emailValidated = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private resetPasswordService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router

  ) {
    this.initForm();
  }

  ngOnInit() {
    this.forgotPasswordForm.get('email')?.valueChanges.subscribe(() => {
      this.updateFormValidity();
    });
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [{ value: '', disabled: true }, Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = g.get('newPassword');
    const confirmPassword = g.get('confirmPassword');
    
    if (!newPassword || !confirmPassword) return null;
    
    return newPassword.value === confirmPassword.value
      ? null : { 'passwordMismatch': true };
  }

  updateFormValidity() {
    const emailControl = this.forgotPasswordForm.get('email');
    if (emailControl && emailControl.valid) {
      this.forgotPasswordForm.setErrors(null);
    } else {
      this.forgotPasswordForm.setErrors({ invalidEmail: true });
    }
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      if (!this.emailValidated) {
        this.validateEmail();
      } else {
        this.changePassword();
      }
    }
  }

  validateEmail() {
    const email = this.forgotPasswordForm.get('email')?.value;
    this.resetPasswordService.validateEmail(email).subscribe(
      (isValid) => {
        if (isValid) {

          this.emailValidated = true;
          const newPasswordControl = this.forgotPasswordForm.get('newPassword');
          const confirmPasswordControl = this.forgotPasswordForm.get('confirmPassword');
          
          if (newPasswordControl && confirmPasswordControl) {
            newPasswordControl.enable();
            confirmPasswordControl.enable();
          }
          this.updateFormValidity();
          this.showSnackBar('Correo electrónico validado. Por favor, ingrese su nueva contraseña.', 'success');
        } else {
          this.showSnackBar('Correo electrónico no encontrado.', 'error');
        }
      },
      (error) => {
        console.log(error)
        this.showSnackBar('Error al validar el correo electrónico.', 'error');
      }
    );
  }

  changePassword() {
    const email = this.forgotPasswordForm.get('email')?.value;
    const newPassword = this.forgotPasswordForm.get('newPassword')?.value;
    
    this.resetPasswordService.resetPassword(email, newPassword).subscribe(
      (response) => {
        console.log(response)

        this.initForm();
        this.emailValidated = false;
        this.updateFormValidity();
        this.showSnackBar('Contraseña cambiada con exito.', 'success');
        this.router.navigate(['/login']);

      },
      (error) => {
        console.log(error)

        this.errorMessage = 'Error al cambiar la contraseña.';
        this.showSnackBar('Error al cambiar la contraseña.', 'error');

      }
    );
  }
  showSnackBar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }
}
