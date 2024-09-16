import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    public messageService:MessageService
  ) { }

  handleError(message:string){
    this.messageService.add({
        key:'tst',
        severity:'error',
        summary:'Error Message',
        detail: message,
        life:2000
    });
  }

  handleSuccess(){
    this.messageService.add({
        key:'tst',
        severity:'info',
        summary:'Confirmado',
        detail: 'Información registrada o actualizada',
        life:2000
    });
  }

  handleDelete(){
    this.messageService.add({
        key:'tst',
        severity:'info',
        summary:'Confirmado',
        detail: 'Información eliminada correctamente',
        life:2000
    });
  }

  noResultsMessage(messageException: any){
    this.messageService.add({
        key:'tst',
        severity:'info',
        summary:'Atención',
        detail: 'No se encontró información',
        life:2000
    });
  }
}
