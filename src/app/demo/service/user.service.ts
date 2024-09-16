import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../api/config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  getUsers(req:any){
    return this.http.post(`${URL_API}/api/user/list` ,req,{
        headers:{
            'Content-Type':'application/json'
        }
    }).toPromise()
    .then(res => res);
  }

  saveUser(req:any){
    return this.http.post(`${URL_API}/api/user/create` ,req,{
        headers:{
            'Content-Type':'application/json'
        }
    }).toPromise()
    .then(res => res);
  }

  searchUsers(req: any) {
    return this.http.post(`${URL_API}/api/user/search`, req, { 
      headers: {
        'Content-Type': 'application/json'
      }
    }).toPromise()
      .then(res => res);
  }

  deleteUser(req:any){
    return this.http.post(`${URL_API}/api/user/delete` ,req,{
        headers:{
            'Content-Type':'application/json'
        }
    }).toPromise()
    .then(res => res);
  }
}
