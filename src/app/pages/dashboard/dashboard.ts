import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink
} from '@angular/router';

import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartData
} from 'chart.js';

import { AuthService } from '../../services/auth';
import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BaseChartDirective
  ],
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
   * Lista utilizada pela tabela
   * de chamados recentes.
   */
  tickets: Ticket[] = [];

  /**
   * Quantidade total de chamados cadastrados.
   */
  totalChamados = 0;

  /**
   * Quantidade de chamados abertos.
   */
  chamadosAbertos = 0;

  /**
   * Quantidade de chamados em atendimento.
   */
  chamadosAtendimento = 0;

  /**
   * Quantidade de chamados finalizados.
   */
  chamadosFinalizados = 0;

  /**
   * Quantidade de chamados classificados
   * com prioridade alta.
   */
  chamadosAltaPrioridade = 0;

  /**
   * Controla o tema visual do dashboard.
   *
   * A preferência armazenada no navegador
   * é recuperada ao carregar o componente.
   */
  temaEscuro = localStorage.getItem('tema') === 'escuro';

  /**
   * Define o tipo do gráfico.
   *
   * O tipo literal evita incompatibilidade
   * entre o template e os dados do Chart.js.
   */
  chartType: 'bar' = 'bar';

  /**
   * Dados utilizados pelo gráfico
   * de chamados agrupados por status.
   */
  chartData: ChartData<'bar'> = {
    labels: [
      'Abertos',
      'Em atendimento',
      'Finalizados'
    ],
    datasets: [
      {
        label: 'Chamados',
        data: [0, 0, 0]
      }
    ]
  };

  /**
   * Configurações visuais e comportamentais
   * aplicadas ao gráfico do dashboard.
   */
  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
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
   * Alterna entre os temas claro e escuro
   * e salva a preferência no navegador.
   */
  alternarTema(): void {
    this.temaEscuro = !this.temaEscuro;

    localStorage.setItem(
      'tema',
      this.temaEscuro ? 'escuro' : 'claro'
    );
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

    this.chamadosAltaPrioridade =
      this.tickets.filter(
        ticket => ticket.prioridade === 'Alta'
      ).length;

    this.atualizarGrafico();
  }

  /**
   * Atualiza o gráfico com base nos indicadores
   * calculados a partir dos chamados cadastrados.
   */
  private atualizarGrafico(): void {
    this.chartData = {
      labels: [
        'Abertos',
        'Em atendimento',
        'Finalizados'
      ],
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