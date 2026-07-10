import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Usuario } from '../../models/usuario';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
/**
 * Página responsável pelo gerenciamento
 * dos usuários da aplicação.
 */
export class Users implements OnInit {

  /**
   * Lista original de usuários cadastrados.
   */
  usuarios: Usuario[] = [];

  /**
   * Lista filtrada exibida na tabela.
   */
  usuariosFiltrados: Usuario[] = [];

  /**
   * Formulário utilizado no cadastro
   * e na edição de usuários.
   */
  userForm!: FormGroup;

  /**
   * Termo utilizado na pesquisa.
   */
  termoPesquisa = '';

  /**
   * Controla o modo de edição.
   */
  editando = false;

  /**
   * Identificador do usuário em edição.
   */
  usuarioEditandoId: number | null = null;

  /**
   * Mensagem exibida no toast.
   */
  mensagemToast = '';

  /**
   * Controla a visibilidade do toast.
   */
  mostrarToast = false;

  /**
   * Recupera a preferência de tema
   * armazenada no navegador.
   */
  temaEscuro = localStorage.getItem('tema') === 'escuro';

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  /**
   * Inicializa o formulário e carrega
   * os usuários cadastrados.
   */
  ngOnInit(): void {
    this.criarFormulario();
    this.carregarUsuarios();
  }

  /**
   * Inicializa o formulário reativo.
   */
  private criarFormulario(): void {
    this.userForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      perfil: ['Cliente', [Validators.required]],
      ativo: [true]
    });
  }

  /**
   * Carrega os usuários do serviço.
   */
  private carregarUsuarios(): void {
    this.usuarios = this.userService.listar();
    this.aplicarFiltro();
  }

  /**
   * Filtra usuários por nome, e-mail ou perfil.
   */
  aplicarFiltro(): void {
    const termo = this.termoPesquisa
      .trim()
      .toLowerCase();

    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      usuario.nome.toLowerCase().includes(termo) ||
      usuario.email.toLowerCase().includes(termo) ||
      usuario.perfil.toLowerCase().includes(termo)
    );
  }

  /**
   * Cria ou atualiza um usuário.
   */
  salvar(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    if (this.editando && this.usuarioEditandoId !== null) {
      const usuarioAtualizado: Usuario = {
        id: this.usuarioEditandoId,
        ...this.userForm.value
      };

      this.userService.atualizar(usuarioAtualizado);
      this.exibirToast('Usuário atualizado com sucesso.');
    } else {
      this.userService.criar(this.userForm.value);
      this.exibirToast('Usuário cadastrado com sucesso.');
    }

    this.limparFormulario();
    this.carregarUsuarios();
  }

  /**
   * Preenche o formulário com os dados
   * do usuário selecionado.
   */
  editar(usuario: Usuario): void {
    this.editando = true;
    this.usuarioEditandoId = usuario.id;

    this.userForm.patchValue(usuario);
  }

  /**
   * Exclui um usuário após confirmação.
   */
  excluir(id: number): void {
    const confirmar = confirm(
      'Deseja realmente excluir este usuário?'
    );

    if (!confirmar) {
      return;
    }

    this.userService.excluir(id);
    this.carregarUsuarios();
    this.exibirToast('Usuário excluído com sucesso.');
  }

  /**
   * Limpa o formulário e encerra
   * o modo de edição.
   */
  limparFormulario(): void {
    this.userForm.reset({
      perfil: 'Cliente',
      ativo: true
    });

    this.editando = false;
    this.usuarioEditandoId = null;
  }

  /**
   * Alterna o tema e salva a preferência.
   */
  alternarTema(): void {
    this.temaEscuro = !this.temaEscuro;

    localStorage.setItem(
      'tema',
      this.temaEscuro ? 'escuro' : 'claro'
    );
  }

  /**
   * Exibe uma mensagem temporária.
   */
  private exibirToast(mensagem: string): void {
    this.mensagemToast = mensagem;
    this.mostrarToast = true;

    setTimeout(() => {
      this.mostrarToast = false;
    }, 3000);
  }
}