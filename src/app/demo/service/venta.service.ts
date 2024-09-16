import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../api/config';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

    constructor(private http: HttpClient) { }

    getAll(req: any) {
        return this.http.post(URL_API + "/api/ventas/listar", req, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).toPromise();
      }


    Save(req: any) {
        return this.http.post(URL_API + "/api/ventas/crear", req, {
            headers: { 'Content-Type': 'application/json' }
        }).toPromise()
            .then(res => res);
    }

    Delete(id: number) {
        return this.http.delete(URL_API + "/api/ventas/eliminar?id=" + id, {
            headers: { 'Content-Type': 'application/json' }
        }).toPromise()
            .then(res => res);
    }
}
