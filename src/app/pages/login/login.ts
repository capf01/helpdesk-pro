import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  /**
   * Formulário responsável por armazenar
   * as credenciais informadas pelo usuário.
   */
  loginForm = this.fb.group({

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    senha: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]

  });

  constructor(

    private fb: FormBuilder,

    private router: Router,

    private authService: AuthService

  ) {}

  /**
   * Realiza a validação do formulário
   * e inicia o fluxo de autenticação.
   */
  entrar(): void {

    // Impede o envio caso existam campos inválidos.
    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;

    }

    // Simula o login da aplicação.
    this.authService.login();

    // Redireciona o usuário para o Dashboard.
    this.router.navigate(['/dashboard']);

  }

}