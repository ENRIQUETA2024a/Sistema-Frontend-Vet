import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_API } from '../api/config';
import * as sha512 from 'js-sha512';
import { Router } from '@angular/router';
import { AuthResponse } from '../api/auth';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private http: HttpClient) { }

  isLogued(): boolean {
    return !!localStorage.getItem('token_sigvet');
  }

  logout(): void {

    localStorage.removeItem('token_sigvet');
    localStorage.removeItem('user_vet');
    this.router.navigate(["/auth/login"]);
  }

  login(data: { username: string; password: string }): Promise<AuthResponse> {
    return this.http.post<AuthResponse>(`${URL_API}/login`, {
      username: data.username,
      password: sha512.sha512(data.password).toString().toUpperCase()
    }).pipe(
      map(response => {
        if (response.isSuccess && response.token) {
          localStorage.setItem('token_sigvet', response.token);
          if (response.user) {
            localStorage.setItem('user_vet', JSON.stringify({
              'username': response.user.username,
              'role_id': response.user.role_id,
              'user_id': response.user.id
            }));
          }
        }
        return response;
      }),
      catchError(error => {
        console.error('Error en la autenticación:', error);
        return of({ isSuccess: false } as AuthResponse);
      })
    ).toPromise();
  }
}
