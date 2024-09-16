import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../api/config';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

    constructor(private http:HttpClient) { }

    login(req:any){
        return this.http.post(URL_API+"/login" ,req,{
            headers:{
                'Content-Type':'application/json'
            }
        }).toPromise()
        .then(res => res);
    }
}
