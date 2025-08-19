import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { passwordsMatchValidator } from './register.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  token: string | null = null;
  message = '';
  error = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: passwordsMatchValidator
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.error = 'Token não encontrado';
    }
  }

  onSubmit(): void {
    if (this.form.invalid || !this.token) {
      return;
    }

    this.loading = true;
    this.message = '';
    this.error = '';

    this.authService.resetPassword(this.token, this.form.value.password).subscribe({
      next: () => {
        this.message = 'Senha alterada com sucesso!';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/login'], { queryParams: { resetSuccess: true } });
        }, 2000);
      },
      error: (err) => {
        this.error = err.error.message || 'Erro ao redefinir senha';
        this.loading = false;
      }
    });
  }
}
