import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
/**
 * Página principal da aplicação.
 *
 * Responsável por apresentar indicadores
 * e os chamados mais recentes.
 */
export class Dashboard {

  /**
   * Lista utilizada pela tabela de chamados.
   */
  tickets: Ticket[] = [];

  /**
   * Indicadores exibidos nos cards do dashboard.
   */
  totalChamados = 0;

  chamadosAbertos = 0;

  chamadosAtendimento = 0;

  chamadosFinalizados = 0;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router
  ) {
    this.carregarDados();
  }

  /**
   * Encerra a sessão atual e redireciona
   * o usuário para a tela de login.
   */
  sair(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Centraliza o carregamento das informações
   * exibidas no dashboard.
   */
  private carregarDados(): void {
    this.tickets = this.ticketService.listar();

    this.totalChamados =
      this.ticketService.total();

    this.chamadosAbertos =
      this.ticketService.contarPorStatus('Aberto');

    this.chamadosAtendimento =
      this.ticketService.contarPorStatus('Em atendimento');

    this.chamadosFinalizados =
      this.ticketService.contarPorStatus('Finalizado');
  }
}