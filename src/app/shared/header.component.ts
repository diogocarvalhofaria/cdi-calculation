import {Component, OnInit, Inject, PLATFORM_ID, OnDestroy, HostListener} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';
import {AuthService, CurrentUser} from '../services/auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentUser: CurrentUser | null = null;
  isDropdownOpen = false;
  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupMenuToggle();

      this.subscriptions.push(
        this.authService.isLoggedIn$.subscribe(value => this.isLoggedIn = value),
        this.authService.currentUser$.subscribe(user => this.currentUser = user)
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setupMenuToggle(): void {
    const toggleButton = document.querySelector('[data-collapse-toggle="mobile-menu"]');
    const menu = document.getElementById('mobile-menu');

    if (toggleButton && menu) {
      toggleButton.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        const icons = toggleButton.querySelectorAll('svg');
        icons.forEach(icon => icon.classList.toggle('hidden'));
      });
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent): void {
    const dropdown = document.getElementById('user-dropdown');
    const profileButton = document.getElementById('profile-button');

    if (dropdown && profileButton &&
      !dropdown.contains(event.target as Node) &&
      !profileButton.contains(event.target as Node)) {
      this.isDropdownOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.isDropdownOpen = false;
  }
}
