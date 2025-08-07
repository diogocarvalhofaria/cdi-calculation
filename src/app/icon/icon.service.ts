import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  registerIcons(): void {
    this.registerHeroIcons();
  }

  private registerHeroIcons(): void {
    this.registerIcon('heroicons_outline', 'banknotes', 'assets/icons/heroicons/outline/banknotes.svg');

    // Aqui você pode adicionar outros ícones conforme necessário
    // this.registerIcon('heroicons_outline', 'calendar', 'assets/icons/heroicons/outline/calendar.svg');
    // this.registerIcon('heroicons_outline', 'chart', 'assets/icons/heroicons/outline/chart.svg');
  }

  private registerIcon(namespace: string, name: string, path: string): void {
    this.matIconRegistry.addSvgIconInNamespace(
      namespace,
      name,
      this.domSanitizer.bypassSecurityTrustResourceUrl(path)
    );
  }
}
