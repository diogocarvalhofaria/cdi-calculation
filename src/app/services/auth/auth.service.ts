import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CreateUserGQL, CreateUserInput, User } from '../../../generated/graphql';
import { isPlatformBrowser } from '@angular/common';

const API_URL = 'http://localhost:3000';

export interface CurrentUser {
  id?: string;
  name: string;
  email: string;
  photoUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this._isLoggedIn.asObservable();

  private _currentUser = new BehaviorSubject<CurrentUser | null>(null);
  public currentUser$ = this._currentUser.asObservable();

  constructor(
    private http: HttpClient,
    private createUserGQL: CreateUserGQL,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      if (token) {
        this._isLoggedIn.next(true);
        this.loadUserData();
      }
    }
  }

  private loadUserData(): void {
    this.getProfile().subscribe({
      next: (user) => {
        this._currentUser.next({
          id: user.id,
          name: user.name,
          email: user.email,
          photoUrl: 'https://via.placeholder.com/40'
        });
      },
      error: () => this.logout()
    });
  }

  login(credentials: {email: string, password: string}): Observable<any> {
    return this.http.post<any>(`${API_URL}/auth/login`, credentials).pipe(
      tap(response => {
        console.log('Resposta do login:', response);
        const token = response.access_token || response.acess_token;

        if (token && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('auth_token', token);
          this._isLoggedIn.next(true);
          this.loadUserData();
        } else if (!token) {
          console.error('Token não encontrado na resposta:', response);
          throw new Error('Token de autenticação não encontrado');
        }
      })
    );
  }

  register(data: CreateUserInput): Observable<{ status: number; message: string; }> {
    return this.createUserGQL.mutate({
      createUserInput: data,
    }).pipe(
      switchMap(({ data, errors }) => {
        if (errors) {
          throw new Error(errors.map(e => e.message).join(', '));
        }
        if (!data?.createUser) {
          throw new Error('Usuário não criado');
        }
        return of(data.createUser);
      }),
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
    }
    this._isLoggedIn.next(false);
    this._currentUser.next(null);
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('auth_token') : null;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${API_URL}/auth/profile`);
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get(`${API_URL}/auth/verify-email`, {
      params: { token }
    });
  }
}
