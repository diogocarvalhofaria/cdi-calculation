import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-link-invalido',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './link-invalid.component.html',
})
export class LinkInvalidComponent {
  constructor(private router: Router) {}

  voltarParaLogin() {
    this.router.navigate(['/login']);
  }
}
