import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../api/config';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

    constructor(private http:HttpClient) { }

    getClients(req:any){
        return this.http.post(URL_API+"/api/clients/list" ,req,{
            headers:{
                'Content-Type':'application/json'
            }
        }).toPromise()
        .then(res => res);
    }

    Save(req:any){
        let formData:FormData = new FormData()
        formData.append("id",req.id)
        formData.append("names",req.names)
        formData.append("lastnames",req.lastnames)
        formData.append("document_number",req.document_number)
        formData.append("document_type",req.document_type)
        formData.append("address",req.address)
        formData.append("city",req.city)
        formData.append("email",req.email)
        formData.append("phone",req.phone)
        formData.append("photo",req.photo)

        return this.http.post(URL_API+"/api/clients/create", formData).toPromise()
        .then(res => res)
    }

    searchClients(req: any) {
        return this.http.post(`${URL_API}/api/clients/search`, req, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).toPromise()
          .then(res => res);
      }

    Delete(id:number){
        return this.http.delete(URL_API+"/api/clients/delete?id="+id,{
            headers:{
                'Content-Type':'application/json'
            }
        }).toPromise()
        .then(res => res);
      }
}
