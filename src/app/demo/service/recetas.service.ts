import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../api/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecetasService {

    constructor(private http: HttpClient) { }

    List(req:any){
        return this.http.post(URL_API+"/api/recetas/list" ,req,{
            headers:{
                'Content-Type':'application/json'
            }
        }).toPromise()
        .then(res => res);
    }

    Create(req:any){
        return this.http.post(URL_API+"/api/recetas/create" ,req,{
          headers:{
              'Content-Type':'application/json'
          }
      }).toPromise()
      .then(res => res);
    }

    Delete(id:number){
        return this.http.delete(URL_API+"/api/recetas/delete?id="+id,{
            headers:{
                'Content-Type':'application/json'
            }
        }).toPromise()
        .then(res => res);
    }

    GeneratePDF(id:number):Observable<Blob>{
        return this.http.post(URL_API+"/api/recetas/pdf",{id},{responseType:'blob'})
    }
}
