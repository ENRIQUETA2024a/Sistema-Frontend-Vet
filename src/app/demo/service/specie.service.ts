import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../api/config';

@Injectable({
  providedIn: 'root'
})
export class SpecieService {

    constructor(private http:HttpClient) { }

    getSpecies(req:any){
      return this.http.post(URL_API+"/api/species/list" ,req,{
          headers:{
              'Content-Type':'application/json'
          }
      }).toPromise()
      .then(res => res);
    }

    saveSpecie(req:any){
        return this.http.post(URL_API+"/api/species/create" ,req,{
          headers:{
              'Content-Type':'application/json'
          }
      }).toPromise()
      .then(res => res);
    }

    searchSpecies(req: any) {
        return this.http.post(`${URL_API}/api/species/search`, req, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).toPromise()
          .then(res => res);
      }


    delete(id:number){
        return this.http.delete(URL_API+"/api/species/delete?id="+id,{
            headers:{
                'Content-Type':'application/json'
            }
        }).toPromise()
        .then(res => res);
      }

  }
