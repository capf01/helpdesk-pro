/**
 * Representa um usuário cadastrado
 * no sistema HelpDesk Pro.
 */
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: 'Administrador' | 'Técnico' | 'Cliente';
  ativo: boolean;
}