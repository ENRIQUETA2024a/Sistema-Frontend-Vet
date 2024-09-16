import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../api/config';

@Injectable({
  providedIn: 'root'
})
export class DiagnosisService {

    constructor(private http:HttpClient) { }

    List(req:any){
        return this.http.post(URL_API+"/api/diagnosis/list" ,req,{
            headers:{
                'Content-Type':'application/json'
            }
        }).toPromise()
        .then(res => res);
    }

    Save(req:any){
        return this.http.post(URL_API+"/api/diagnosis/create" ,req,{
          headers:{
              'Content-Type':'application/json'
          }
      }).toPromise()
      .then(res => res);
    }

    Delete(id:number){
        return this.http.delete(URL_API+"/api/diagnosis/delete?id="+id,{
            headers:{
                'Content-Type':'application/json'
            }
        }).toPromise()
        .then(res => res);
      }
}
