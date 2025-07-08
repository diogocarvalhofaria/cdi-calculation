import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FooterComponent} from '../shared/footer.component';

@Component({
  selector: 'app-terms-of-use',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './terms-list.component.html',
})
export class TermsOfUseComponent {
}
