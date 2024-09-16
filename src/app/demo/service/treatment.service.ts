import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../api/config';

@Injectable({
  providedIn: 'root'
})
export class TreatmentService {

    constructor(private http:HttpClient) { }

    List(req:any){
      return this.http.post(URL_API+"/api/treatments/list" ,req,{
          headers:{
              'Content-Type':'application/json'
          }
      }).toPromise()
      .then(res => res);
    }

    create(req:any){
        return this.http.post(URL_API+"/api/treatments/create" ,req,{
          headers:{
              'Content-Type':'application/json'
          }
      }).toPromise()
      .then(res => res);
    }

    detail(req:any){
        return this.http.post(URL_API+"/api/treatments/detail" ,req,{
          headers:{
              'Content-Type':'application/json'
          }
      }).toPromise()
      .then(res => res);
    }

    delete(id:number){
        return this.http.delete(URL_API+"/api/treatments/delete?id="+id,{
            headers:{
                'Content-Type':'application/json'
            }
        }).toPromise()
        .then(res => res);
      }

}
