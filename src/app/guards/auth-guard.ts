import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
/**
 * Guarda de rota responsável por proteger
 * páginas que exigem autenticação.
 */
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Verifica se o usuário possui sessão ativa.
   *
   * Caso contrário, redireciona para a tela de login.
   */
  canActivate(): boolean {
    if (this.authService.estaLogado()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}