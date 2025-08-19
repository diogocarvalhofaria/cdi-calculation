import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  form: FormGroup;
  message = '';
  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.message = '';
    this.error = '';
    if (this.form.invalid) return;

    this.authService.sendPasswordResetEmail(this.form.value.email).subscribe({
      next: () => this.message = 'Se o e-mail existir, você receberá instruções para redefinir a senha.',
      error: () => this.error = 'Erro ao enviar e-mail. Tente novamente.',
    });
  }
}
