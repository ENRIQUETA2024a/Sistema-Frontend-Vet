import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = localStorage.getItem('token_sigvet');

      if (token) {

        const clonedRequest = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });


        return next.handle(clonedRequest);
      } else {

        return next.handle(req);
      }
    }
  }
