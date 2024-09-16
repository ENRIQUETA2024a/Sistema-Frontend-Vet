import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../api/config';

@Injectable({
  providedIn: 'root'
})
export class BreedService {

    constructor(private http:HttpClient) { }

    getBreeds(req:any){
      return this.http.post(URL_API+"/api/breeds/list" ,req,{
          headers:{
              'Content-Type':'application/json'
          }
      }).toPromise()
      .then(res => res);
    }

    saveBreed(req:any){
        return this.http.post(URL_API+"/api/breeds/create" ,req,{
          headers:{
              'Content-Type':'application/json'
          }
      }).toPromise()
      .then(res => res);
    }

    searchBreeds(req: any) {
        return this.http.post(`${URL_API}/api/breeds/search`, req, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).toPromise()
          .then(res => res);
      }

    deleteBreed(id:number){
        return this.http.delete(URL_API+"/api/breeds/delete?id="+id,{
            headers:{
                'Content-Type':'application/json'
            }
        }).toPromise()
        .then(res => res);
      }

  }
