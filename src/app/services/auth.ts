import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * Armazena uma sessão simples
   * utilizando o LocalStorage.
   */
  login(): void {

    localStorage.setItem(
      'usuarioLogado',
      'true'
    );

  }

  /**
   * Remove a sessão do usuário.
   */
  logout(): void {

    localStorage.removeItem(
      'usuarioLogado'
    );

  }

  /**
   * Verifica se existe uma sessão ativa.
   */
  estaLogado(): boolean {

    return localStorage.getItem(
      'usuarioLogado'
    ) === 'true';

  }

}