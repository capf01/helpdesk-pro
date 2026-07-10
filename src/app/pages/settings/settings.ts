import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
/**
 * Página responsável pelas preferências
 * gerais do sistema HelpDesk Pro.
 */
export class Settings {

  /**
   * Formulário utilizado para armazenar
   * as configurações do usuário.
   */
  settingsForm: FormGroup;

  /**
   * Controla a mensagem de confirmação.
   */
  mensagemToast = '';

  /**
   * Controla a visibilidade do toast.
   */
  mostrarToast = false;

  /**
   * Recupera o tema salvo no navegador.
   */
  temaEscuro = localStorage.getItem('tema') === 'escuro';

  constructor(
    private fb: FormBuilder
  ) {
    this.settingsForm = this.fb.group({
      notificacoesEmail: [
        localStorage.getItem('notificacoesEmail') !== 'false'
      ],
      notificacoesSistema: [
        localStorage.getItem('notificacoesSistema') !== 'false'
      ],
      modoCompacto: [
        localStorage.getItem('modoCompacto') === 'true'
      ]
    });
  }

  /**
   * Salva as preferências no LocalStorage.
   */
  salvarConfiguracoes(): void {
    const configuracoes = this.settingsForm.getRawValue();

    localStorage.setItem(
      'notificacoesEmail',
      String(configuracoes.notificacoesEmail)
    );

    localStorage.setItem(
      'notificacoesSistema',
      String(configuracoes.notificacoesSistema)
    );

    localStorage.setItem(
      'modoCompacto',
      String(configuracoes.modoCompacto)
    );

    this.exibirToast('Configurações salvas com sucesso.');
  }

  /**
   * Alterna o tema visual e salva
   * a preferência no navegador.
   */
  alternarTema(): void {
    this.temaEscuro = !this.temaEscuro;

    localStorage.setItem(
      'tema',
      this.temaEscuro ? 'escuro' : 'claro'
    );
  }

  /**
   * Exibe uma mensagem temporária
   * de confirmação para o usuário.
   */
  private exibirToast(mensagem: string): void {
    this.mensagemToast = mensagem;
    this.mostrarToast = true;

    setTimeout(() => {
      this.mostrarToast = false;
    }, 3000);
  }
}