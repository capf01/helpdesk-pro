import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})
/**
 * Página responsável pelo gerenciamento
 * completo dos chamados técnicos.
 */
export class Tickets implements OnInit {

  /**
   * Lista exibida na tabela.
   */
  tickets: Ticket[] = [];

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
    } else {
      this.ticketService.criar(this.ticketForm.value);
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
}