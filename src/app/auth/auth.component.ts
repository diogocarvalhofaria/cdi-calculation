import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import {HttpClient} from '@angular/common/http';

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
export class AuthComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  emailVerified: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.emailVerified = params['verified'] === 'true';
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }


    this.errorMessage = '';
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Falha no login. Verifique suas credenciais.';
        console.error(err);
      }
    });
  }
}
