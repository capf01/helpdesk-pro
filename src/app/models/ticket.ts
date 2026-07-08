/**
 * Representa um chamado técnico dentro do sistema.
 */
export interface Ticket {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  prioridade: 'Baixa' | 'Média' | 'Alta';
  status: 'Aberto' | 'Em atendimento' | 'Finalizado';
  dataAbertura: string;
}