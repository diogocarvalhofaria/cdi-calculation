import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class AppComponent {
  cdiForm: FormGroup;
  months = [6, 12, 24, 36, 48, 60];
  showResult = false;
  result = {
    finalValue: 0,
    totalInvested: 0,
    interest: 0
  };

  constructor(private fb: FormBuilder) {
    this.cdiForm = this.fb.group({
      cdiPercent: [100, [Validators.required, Validators.min(0)]],
      initialValue: [1000, [Validators.required, Validators.min(0)]],
      period: [12, [Validators.required]],
      monthlyContribution: [0, [Validators.min(0)]]
    });
  }

  onCalculate() {
    this.result = {
      finalValue: 0,
      totalInvested: 0,
      interest: 0
    };
    this.showResult = true;
  }
}
