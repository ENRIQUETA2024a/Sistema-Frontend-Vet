import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared/shared.module';
import { CommonService } from '../../service/common.service';
import { DOCUMENT_TYPE, ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
import { Client } from '../../api/client';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../service/client.service';
import { ConfirmationService } from 'primeng/api';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
  providers:[CommonService]
})
export class ClientComponent implements OnInit{

    req={
        index:0,
        limit:ROWS_DEFAULT
    }

    totalRecords:number = ROWS_DEFAULT
    rowsOptions:number[] = ROWS_OPTIONS
    first:number = 0
    titleForm:string = 'Nuevo cliente'
    lstClients:Client[]
    loading:boolean = false
    isDialog:boolean = false
    client!:Client
    formClient:FormGroup
    submitted:boolean = false
    loadingSave:boolean = false

    file!:File
    searchClient: string = '';
    documents:any[] = DOCUMENT_TYPE

    constructor(
        private clientService:ClientService,

        private fb:FormBuilder,
        private commonService:CommonService,
        private confirmationService:ConfirmationService
    ){
        this.formClient = this.fb.group({
            names:['',[Validators.required, Validators.pattern(/^[A-Za-z\s\xF1\xD1áéíóúÁÉÍÓÚüÜ]+$/)]],
            lastnames:['',[Validators.required, Validators.pattern(/^[A-Za-z\s\xF1\xD1áéíóúÁÉÍÓÚüÜ]+$/)]],
            document_number:['',[Validators.required,Validators.minLength(8),Validators.maxLength(12)]],
            document_type:['',[Validators.required,]],
            phone:['',[Validators.required, Validators.pattern(/^([0-9])*$/),Validators.maxLength(9), Validators.minLength(5),]],
            address:[''],
            city:[''],
            email:['',[Validators.email]],
            photo:['']
        })
    }

    ngOnInit(): void {
        this.List(this.req);
    }

    searchClients() {
        this.loading = true;

        const request = {
          index: this.req.index,
          limit: this.req.limit,
          search: this.searchClient
        };

        this.clientService.searchClients(request).then((res: any) => {
          if (res.isSuccess) {
            this.lstClients = res.data;
            this.totalRecords = res.total;
          } else {
            this.commonService.noResultsMessage(res.messageException);
          }
          this.loading = false;
        }).catch((error) => {
          console.error('Error:', error);
          this.loading = false;
        });
      }

      clearSearch() {
        this.searchClient = '';
        this.req = {
            index: 0,
            limit: ROWS_DEFAULT
        };
        this.List(this.req);
    }

    List(request:any){
        try {
            this.clientService.getClients(request).then((res:any) => {
                if(res.isSuccess){
                    this.lstClients = res.data
                    this.loading = false
                    this.totalRecords = res.total

                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    newClient(){
        this.isDialog = true
        this.client = {}
        this.submitted = false
    }

    onFileChange(event:any){
        this.file = event.target.files[0]
    }
    changePage(event:any){
        this.req.index = event.first
        this.req.limit = event.rows
        this.first = event.first
        this.List(this.req);
    }

    hideDialog(){
        this.isDialog = false
        this.submitted = false
        this.loadingSave = false
    }

    save(item:Client){
        this.submitted = true

        let value = this.formClient.value

        for(let c in this.formClient.controls){
            this.formClient.controls[c].markAsTouched()
        }

        if(this.formClient.valid){
            this.loadingSave = true
            const currentEmployeeId = this.getCurrentEmployeeId();

            const req = {
                id:item.id ? item.id : 0,
                names:value.names,
                lastnames:value.lastnames,
                document_number:value.document_number,
                document_type:value.document_type,
                phone:value.phone,
                address:value.address,
                city:value.city,
                email:value.email,
                photo:this.file,
                idEmployeeCreates: item.id ? null : currentEmployeeId,
                idEmployeeModifies: item.id ? currentEmployeeId : null,
                modifiedDate: item.id ? new Date() : null
            }
            this.clientService.Save(req).then((res:any) => {
                this.loadingSave = false
                if(res.isSuccess){
                    this.commonService.handleSuccess()
                    this.List(this.req)
                }else{
                    this.commonService.handleError(res.messageException)
                }
            })
            this.file = undefined
            this.hideDialog()
        }
    }

    getCurrentEmployeeId(): number | null {
        const user = JSON.parse(localStorage.getItem('user_vet') || '{}');
        return user?.employee_id || null;
      }


    editClient(item:Client){
        this.isDialog = true
        this.client = item
        this.titleForm = 'Editar cliente'
        this.submitted = false
    }

    deleteClient(event:Event,item:Client){
        this.confirmationService.confirm({
            key:'deleteClient'+item.id,
            target:event.target || new EventTarget,
            message:'¿Desea eliminar el registro?',
            acceptLabel:'Si',
            icon:'pi pi-exclamation-triangle',
            accept:() => {


                this.clientService.Delete(item.id).then((res:any) => {
                    if(res.isSuccess){
                        this.commonService.handleDelete()
                        this.List(this.req)
                    }else{
                        this.commonService.handleError(res.messageException)
                    }
                })
            }
        })
    }
}
