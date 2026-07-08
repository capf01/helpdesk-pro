import { Injectable } from '@angular/core';

import { Ticket } from '../models/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  /**
   * Chave utilizada para persistir
   * os chamados no LocalStorage.
   */
  private readonly STORAGE_KEY = 'helpdesk_tickets';

  /**
   * Lista inicial utilizada apenas quando
   * ainda não houver dados no LocalStorage.
   */
  private readonly ticketsIniciais: Ticket[] = [
    {
      id: 1,
      titulo: 'Erro ao acessar o sistema',
      descricao: 'Usuário relata erro ao tentar acessar o sistema interno.',
      categoria: 'Software',
      prioridade: 'Alta',
      status: 'Aberto',
      dataAbertura: '08/07/2026'
    },
    {
      id: 2,
      titulo: 'Computador não liga',
      descricao: 'Equipamento não apresenta sinal de energia.',
      categoria: 'Hardware',
      prioridade: 'Média',
      status: 'Em atendimento',
      dataAbertura: '08/07/2026'
    }
  ];

  /**
   * Retorna todos os chamados cadastrados.
   */
  listar(): Ticket[] {
    const dados = localStorage.getItem(this.STORAGE_KEY);

    if (!dados) {
      this.salvarTodos(this.ticketsIniciais);
      return this.ticketsIniciais;
    }

    return JSON.parse(dados);
  }

  /**
   * Cadastra um novo chamado.
   */
  criar(ticket: Omit<Ticket, 'id' | 'dataAbertura'>): void {
    const tickets = this.listar();

    const novoTicket: Ticket = {
      ...ticket,
      id: Date.now(),
      dataAbertura: new Date().toLocaleDateString('pt-BR')
    };

    tickets.push(novoTicket);

    this.salvarTodos(tickets);
  }

  /**
   * Atualiza um chamado existente.
   */
  atualizar(ticketAtualizado: Ticket): void {
    const tickets = this.listar().map(ticket =>
      ticket.id === ticketAtualizado.id ? ticketAtualizado : ticket
    );

    this.salvarTodos(tickets);
  }

  /**
   * Remove um chamado pelo identificador.
   */
  excluir(id: number): void {
    const tickets = this.listar().filter(ticket => ticket.id !== id);

    this.salvarTodos(tickets);
  }

  /**
   * Retorna a quantidade total de chamados.
   */
  total(): number {
    return this.listar().length;
  }

  /**
   * Conta os chamados de acordo com o status.
   */
  contarPorStatus(status: Ticket['status']): number {
    return this.listar().filter(ticket => ticket.status === status).length;
  }

  /**
   * Persiste a lista completa de chamados.
   */
  private salvarTodos(tickets: Ticket[]): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(tickets)
    );
  }
}