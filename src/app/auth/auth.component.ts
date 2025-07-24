import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {AuthService} from '../services/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage = '';
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        // Redireciona para uma página protegida após o login, ex: '/profile'
        // this.router.navigate(['/profile']);
      },
      error: (err) => {
        // Exibe o erro vindo do backend, como "Senha inválida" [cite: 47]
        this.errorMessage = err.error.message || 'Falha no login. Verifique suas credenciais.';
        console.error(err);
      }
    });
  }
}
