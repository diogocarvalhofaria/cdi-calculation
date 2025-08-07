import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {NgApexchartsModule} from 'ng-apexcharts';
import {FooterComponent} from './shared/footer.component';
import { HeaderComponent } from './shared/header.component';
import {RouterModule} from '@angular/router';
import {IconService} from './icon/icon.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [CommonModule, ReactiveFormsModule, NgApexchartsModule, FooterComponent, HeaderComponent, RouterModule]
})
export class AppComponent {
  constructor(private iconService: IconService) {
    this.iconService.registerIcons();
  }

}
