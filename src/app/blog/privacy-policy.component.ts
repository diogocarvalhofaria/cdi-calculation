
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../shared/footer.component';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './privacy-list.component.html',
})
export class PrivacyPolicyComponent {}
