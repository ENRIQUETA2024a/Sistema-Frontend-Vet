import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../api/config';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

    constructor(private http:HttpClient) { }

    List(req:any){
        return this.http.post(URL_API+"/api/patients/list" ,req,{
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
        formData.append("breed_id",req.breed_id)
        formData.append("client_id",req.client_id)
        formData.append("birthday",req.birthday)
        formData.append("age",req.age)
        formData.append("sex",req.sex)
        formData.append("color",req.color)
        formData.append("fur",req.fur)
        formData.append("particularity",req.particularity)
        formData.append("allergy",req.allergy)
        formData.append("photo",req.photo)

        return this.http.post(URL_API+"/api/patients/create", formData).toPromise()
        .then(res => res)
    }

    Delete(id:number){
        return this.http.delete(URL_API+"/api/patients/delete?id="+id,{
            headers:{
                'Content-Type':'application/json'
            }
        }).toPromise()
        .then(res => res);
      }
}
