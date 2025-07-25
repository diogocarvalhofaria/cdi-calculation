import {Injectable} from '@angular/core';
import {Observable, of, switchMap, tap} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {CreateUserGQL, CreateUserInput, User} from '../../../generated/graphql';


const API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private token: string | null = null;

  constructor(private http: HttpClient,
  private createUserGQL: CreateUserGQL,
  ) {
  }


  /**
   * Envia as credenciais para o endpoint de login da API.
   * @param credentials - Email e senha do usuário.
   * @returns Observable com o token de acesso.
   */

  login(credentials: {email: string, password: string}): Observable<{ acess_token: string }> {
    return this.http.post<{ acess_token: string }>(`${API_URL}/auth/login`, credentials).pipe(
      tap(response => {
        // Armazena o token no localStorage após o login
        localStorage.setItem('auth_token', response.acess_token);
      })
    );
  }

  /**
   * Envia os dados do novo usuário para o endpoint de criação.
   * NOTA: Seu backend usa GraphQL para criar usuários[cite: 34, 37].
   * Para este exemplo, vamos assumir que você adicionou um endpoint REST em `user.controller.ts`
   * que chama `userService.createUser()`. Se preferir usar GraphQL,
   * você precisará de uma biblioteca como a 'apollo-angular'.
   * * @param userData - Dados para a criação do usuário (nome, email, senha).
   */

  register(data: CreateUserInput): Observable<{ status: number; message: string; }> {
    return this.createUserGQL.mutate({
      createUserInput: data,
    }).pipe(
      switchMap(({ data }) => {
        if (!data?.createUser) {
          throw new Error('Usuário não criado');
        }
        return of(data.createUser);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  /**
   * Recupera o token de autenticação do localStorage.
   * @returns O token, se existir.
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Verifica se o usuário está autenticado.
   * @returns True se o token existir, senão false.
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Busca os dados do perfil do usuário logado.
   * O AuthInterceptor vai adicionar o token a esta requisição.
   */
  getProfile(): Observable<any> {
    return this.http.get(`${API_URL}/auth/profile`);
  }

}
