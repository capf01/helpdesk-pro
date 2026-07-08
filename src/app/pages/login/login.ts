import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
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
/**
 * Componente responsável pela autenticação
 * do usuário na aplicação.
 */
export class Login implements OnInit {

  /**
   * Formulário de autenticação.
   *
   * O operador "!" informa ao TypeScript que o
   * formulário será inicializado antes de ser utilizado.
   */
  loginForm!: FormGroup;

  constructor(

    /**
     * Responsável pela construção
     * dos formulários reativos.
     */
    private fb: FormBuilder,

    /**
     * Serviço responsável pela navegação
     * entre as páginas da aplicação.
     */
    private router: Router,

    /**
     * Serviço responsável pela autenticação
     * do usuário.
     */
    private authService: AuthService

  ) {}

  /**
   * Método executado automaticamente
   * após a criação do componente.
   */
  ngOnInit(): void {

    this.criarFormulario();

  }

  /**
   * Inicializa o formulário de login.
   */
  private criarFormulario(): void {

    this.loginForm = this.fb.group({

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

  }

  /**
   * Valida o formulário e realiza
   * a autenticação do usuário.
   */
  entrar(): void {

    // Impede o envio caso existam campos inválidos.
    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;

    }

    // Simula a autenticação do usuário.
    this.authService.login();

    // Redireciona para o dashboard.
    this.router.navigate(['/dashboard']);

  }

}