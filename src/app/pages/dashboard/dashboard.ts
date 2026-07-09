import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { BaseChartDirective } from 'ng2-charts';
import {
 ChartConfiguration,
  ChartData,
} from 'chart.js';

import { AuthService } from '../../services/auth';
import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
/**
 * Página principal da aplicação.
 *
 * Responsável por apresentar indicadores,
 * chamados recentes e gráficos analíticos.
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

  /**
   * Tipo do gráfico exibido no dashboard.
   */
  chartType: 'bar' = 'bar';

  /**
   * Dados utilizados pelo gráfico de chamados por status.
   */
  chartData: ChartData<'bar'> = {
    labels: ['Abertos', 'Em atendimento', 'Finalizados'],
    datasets: [
      {
        label: 'Chamados',
        data: [0, 0, 0]
      }
    ]
  };

  /**
   * Configurações visuais do gráfico.
   */
  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    }
  };

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

    this.atualizarGrafico();
  }

  /**
   * Atualiza os dados utilizados pelo gráfico
   * com base nos indicadores do dashboard.
   */
  private atualizarGrafico(): void {
    this.chartData = {
      labels: ['Abertos', 'Em atendimento', 'Finalizados'],
      datasets: [
        {
          label: 'Chamados por status',
          data: [
            this.chamadosAbertos,
            this.chamadosAtendimento,
            this.chamadosFinalizados
          ]
        }
      ]
    };
  }
}