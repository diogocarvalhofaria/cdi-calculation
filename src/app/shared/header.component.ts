import {Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupMenuToggle();
    }
  }

  setupMenuToggle(): void {
    const toggleButton = document.querySelector('[data-collapse-toggle="mobile-menu-2"]');
    const menu = document.getElementById('mobile-menu-2');

    if (toggleButton && menu) {
      toggleButton.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        const icons = toggleButton.querySelectorAll('svg');
        icons.forEach(icon => icon.classList.toggle('hidden'));
      });
    }
  }
}
