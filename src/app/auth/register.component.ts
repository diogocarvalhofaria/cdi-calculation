import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {AuthService} from '../services/auth/auth.service';

// Função para validar se as senhas são iguais
export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  // Se as senhas não forem iguais, retorna um erro 'mismatch'
  return password === confirmPassword ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      // O campo 'name' é obrigatório no seu back-end
      name: ['', Validators.required],
      // O campo 'email' é obrigatório [cite: 13]
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      // O campo 'terms' requer que o checkbox seja marcado
      terms: [false, Validators.requiredTrue],
    }, {
      // Adiciona o validador customizado ao formulário inteiro
      validators: passwordsMatchValidator
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      // Marca todos os campos como "tocados" para exibir os erros
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';

    // Prepara os dados para enviar à API (sem o confirmPassword e terms)
    const { name, email, password } = this.registerForm.value;

    this.authService.register({ name, email, password }).subscribe({
      next: (response) => {
        console.log('Usuário registrado com sucesso!', response);
        alert('Conta criada com sucesso! Faça o login para continuar.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // Exibe o erro vindo do back-end, como "Usuario já existe" [cite: 30]
        this.errorMessage = err.error.message || 'Ocorreu um erro no registro.';
        console.error(err);
      }
    });
  }
}
