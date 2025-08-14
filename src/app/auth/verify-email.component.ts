import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="success" class="text-green-600">E-mail verificado com sucesso!</div>
    <div *ngIf="error" class="text-red-600">Link inválido ou expirado.</div>
  `
})
export class VerifyEmailComponent implements OnInit {
  success = false;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.verifyEmail(token).subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => this.router.navigate(['/login'], { queryParams: { verified: true } }), 2000);
        },
        error: () => {
          this.error = true;
          setTimeout(() => this.router.navigate(['/link-invalido']), 2000);
        }
      });
    } else {
      this.error = true;
      setTimeout(() => this.router.navigate(['/link-invalido']), 2000);
    }
  }
}
