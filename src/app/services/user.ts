import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
/**
 * Serviço responsável pelo gerenciamento
 * e persistência local dos usuários.
 */
export class UserService {

  /**
   * Chave utilizada para armazenar
   * os usuários no LocalStorage.
   */
  private readonly STORAGE_KEY = 'helpdesk_users';

  /**
   * Usuários iniciais utilizados quando
   * ainda não existem dados armazenados.
   */
  private readonly usuariosIniciais: Usuario[] = [
    {
      id: 1,
      nome: 'César Augusto',
      email: 'cesar@helpdesk.com',
      perfil: 'Administrador',
      ativo: true
    },
    {
      id: 2,
      nome: 'Ana Souza',
      email: 'ana@helpdesk.com',
      perfil: 'Técnico',
      ativo: true
    },
    {
      id: 3,
      nome: 'Carlos Lima',
      email: 'carlos@helpdesk.com',
      perfil: 'Cliente',
      ativo: false
    }
  ];

  /**
   * Retorna todos os usuários cadastrados.
   */
  listar(): Usuario[] {

    const dados = localStorage.getItem(this.STORAGE_KEY);

    if (!dados) {

      this.salvarTodos(this.usuariosIniciais);

      return [...this.usuariosIniciais];

    }

    return JSON.parse(dados) as Usuario[];

  }

  /**
   * Cadastra um novo usuário.
   */
  criar(usuario: Omit<Usuario, 'id'>): void {

    const usuarios = this.listar();

    const novoUsuario: Usuario = {

      ...usuario,

      id: Date.now()

    };

    usuarios.push(novoUsuario);

    this.salvarTodos(usuarios);

  }

  /**
   * Atualiza um usuário existente.
   */
  atualizar(usuarioAtualizado: Usuario): void {

    const usuarios = this.listar().map(usuario =>

      usuario.id === usuarioAtualizado.id

        ? usuarioAtualizado

        : usuario

    );

    this.salvarTodos(usuarios);

  }

  /**
   * Remove um usuário pelo identificador.
   */
  excluir(id: number): void {

    const usuarios = this.listar().filter(

      usuario => usuario.id !== id

    );

    this.salvarTodos(usuarios);

  }

  /**
   * Persiste a lista completa de usuários.
   */
  private salvarTodos(usuarios: Usuario[]): void {

    localStorage.setItem(

      this.STORAGE_KEY,

      JSON.stringify(usuarios)

    );

  }

}