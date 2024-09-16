import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../api/config';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http:HttpClient
  ) { }

  DashboardInfo(){
    return this.http.get(URL_API+"/api/dashboard/info").toPromise().then(res => res)
  }
}
