import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})
/**
 * Página responsável pelo gerenciamento
 * completo dos chamados técnicos.
 */
export class Tickets implements OnInit {

  /**
   * Mensagem exibida como feedback visual.
   */
  mensagemToast = '';

  /**
   * Controla a visibilidade do toast.
   */
  mostrarToast = false;

  /**
   * Lista original de chamados.
   */
  tickets: Ticket[] = [];

  /**
   * Lista filtrada exibida na tabela.
   */
  ticketsFiltrados: Ticket[] = [];

  /**
   * Termo utilizado na pesquisa.
   */
  termoPesquisa = '';

  /**
   * Status selecionado no filtro.
   */
  filtroStatus = '';

  /**
   * Controla o tema visual da tela de chamados.
   */
  temaEscuro = localStorage.getItem('tema') === 'escuro';

  /**
   * Formulário utilizado para criar
   * e editar chamados.
   */
  ticketForm!: FormGroup;

  /**
   * Controla se o formulário está em modo edição.
   */
  editando = false;

  /**
   * Armazena o identificador do chamado
   * selecionado para edição.
   */
  ticketEditandoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService
  ) {}

  /**
   * Inicializa o formulário e carrega
   * os chamados ao abrir a tela.
   */
  ngOnInit(): void {
    this.criarFormulario();
    this.carregarTickets();
  }

  /**
   * Alterna o tema visual da aplicação
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
   * Cria o formulário reativo
   * com validações básicas.
   */
  private criarFormulario(): void {
    this.ticketForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.minLength(10)]],
      categoria: ['', [Validators.required]],
      prioridade: ['Média', [Validators.required]],
      status: ['Aberto', [Validators.required]]
    });
  }

  /**
   * Carrega os chamados cadastrados
   * a partir do serviço.
   */
  private carregarTickets(): void {
    this.tickets = this.ticketService.listar();
    this.aplicarFiltros();
  }

  /**
   * Aplica pesquisa por texto e filtro por status
   * sobre a lista de chamados.
   */
  aplicarFiltros(): void {
    const textoPesquisa = this.termoPesquisa.toLowerCase();

    this.ticketsFiltrados = this.tickets.filter(ticket => {
      const correspondePesquisa =
        ticket.titulo.toLowerCase().includes(textoPesquisa) ||
        ticket.categoria.toLowerCase().includes(textoPesquisa) ||
        ticket.prioridade.toLowerCase().includes(textoPesquisa) ||
        ticket.status.toLowerCase().includes(textoPesquisa);

      const correspondeStatus =
        !this.filtroStatus || ticket.status === this.filtroStatus;

      return correspondePesquisa && correspondeStatus;
    });
  }

  /**
   * Cria ou atualiza um chamado
   * de acordo com o estado atual do formulário.
   */
  salvar(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    if (this.editando && this.ticketEditandoId !== null) {
      const ticketAtualizado: Ticket = {
        id: this.ticketEditandoId,
        dataAbertura: new Date().toLocaleDateString('pt-BR'),
        ...this.ticketForm.value
      };

      this.ticketService.atualizar(ticketAtualizado);
      this.exibirToast('Chamado atualizado com sucesso.');
    } else {
      this.ticketService.criar(this.ticketForm.value);
      this.exibirToast('Chamado cadastrado com sucesso.');
    }

    this.limparFormulario();
    this.carregarTickets();
  }

  /**
   * Preenche o formulário com os dados
   * do chamado selecionado para edição.
   */
  editar(ticket: Ticket): void {
    this.editando = true;
    this.ticketEditandoId = ticket.id;

    this.ticketForm.patchValue({
      titulo: ticket.titulo,
      descricao: ticket.descricao,
      categoria: ticket.categoria,
      prioridade: ticket.prioridade,
      status: ticket.status
    });
  }

  /**
   * Remove um chamado da listagem.
   */
  excluir(id: number): void {
    const confirmar = confirm('Deseja realmente excluir este chamado?');

    if (!confirmar) {
      return;
    }

    this.ticketService.excluir(id);
    this.carregarTickets();
    this.exibirToast('Chamado excluído com sucesso.');
  }

  /**
   * Limpa o formulário e retorna
   * para o modo de cadastro.
   */
  limparFormulario(): void {
    this.ticketForm.reset({
      prioridade: 'Média',
      status: 'Aberto'
    });

    this.editando = false;
    this.ticketEditandoId = null;
  }

  /**
   * Exibe uma mensagem temporária
   * de feedback para o usuário.
   */
  private exibirToast(mensagem: string): void {
    this.mensagemToast = mensagem;
    this.mostrarToast = true;

    setTimeout(() => {
      this.mostrarToast = false;
    }, 3000);
  }
}