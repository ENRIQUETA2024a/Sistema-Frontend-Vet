import { AuthService } from './../../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { Service } from '../../api/service';
import { ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../service/service.service';
import { CommonService } from '../../service/common.service';
import { ConfirmationService } from 'primeng/api';
import { SharedModule } from '../../shared/shared/shared.module';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss',
  providers:[CommonService]
})
export class ServiceComponent implements OnInit{

    lstData:Service[]
    req={
        index:0,
        limit:ROWS_DEFAULT
    }

    loading:boolean = false
    totalRegisters:number = ROWS_DEFAULT
    rowsOptions:any[] = ROWS_OPTIONS
    first:number = 0
    titleForm:string = 'Nuevo Servicio'
    isDialog:boolean = false
    loadingSave:boolean = false
    submitted:boolean = false
    service!:Service
    formService:FormGroup

    constructor(
        private serviceService:ServiceService,
        private fb:FormBuilder,
        private commonService:CommonService,
        private confirmationService:ConfirmationService,
        private authService:AuthService
    ){
        this.formService = this.fb.group({
            name:['',[Validators.required]],
            description:['',[Validators.required]],
            price:['',[Validators.required]],
            idUserCreate:[''],
            idUserModifies:[''],

        })
    }

    ngOnInit(): void {
        this.getAll(this.req)
    }

    getAll(request:any){
        this.serviceService.List(request).then((res:any) => {
            if(res.isSuccess){
                this.lstData = res.data
                this.loading = false
                this.totalRegisters = res.total
              }
          })
      } catch (error) {
          console.log(error)
  }

    new(){
        this.isDialog = true
        this.service = {}
        this.submitted = false
    }

    getCurrentUserId(): number | null {
        const user = JSON.parse(localStorage.getItem('user_vet') || '{}');
        return user?.id || null;
      }

    save(item:Service){
        this.submitted = true;
        let value = this.formService.value

        for(let c in this.formService.controls){
            this.formService.controls[c].markAsTouched()
        }
        if(this.formService.valid){
            this.loadingSave = true
            const req = {
                id:item.id ? item.id : 0,
                name:value.name,
                description:value.description,
                price:value.price

            }

            this.serviceService.Save(req).then((res:any) => {
                this.loadingSave = false
                if(res.isSuccess){
                    this.commonService.handleSuccess()
                    this.getAll(this.req)
                }else{
                    this.commonService.handleError(res.messageException)
                }
            })
        }
        this.hideDialog()
    }

    edit(item:Service){
        this.isDialog = true
        this.submitted = false
        this.service = item
        this.titleForm = 'Editar Servicio'
    }

    delete(event:Event,item:Service){
        this.confirmationService.confirm({
            key:'deleteEmployee'+item.id,
            target:event.target || new EventTarget,
            message:'¿Desea eliminar el registro?',
            acceptLabel:'Si',
            icon:'pi pi-exclamation-triangle',
            accept:() => {
                this.serviceService.Delete(item.id).then((res:any) => {
                    if(res.isSuccess){
                        this.commonService.handleDelete()
                        this.getAll(this.req)
                    }else{
                        this.commonService.handleError(res.messageException)
                    }
                })
            }
        })
    }

    hideDialog(){
        this.isDialog = false
        this.submitted = false
        this.loadingSave = false
    }

    changePage(event:any){
        this.req.index = event.first
        this.req.limit = event.rows
        this.first = event.first
        this.getAll(this.req);
    }
}

