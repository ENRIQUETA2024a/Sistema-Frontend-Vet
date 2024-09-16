import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared/shared.module';
import { CommonService } from '../../service/common.service';
import { ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
import { Rol } from '../../api/rol';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolService } from '../../service/rol.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-rol',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './rol.component.html',
  styleUrl: './rol.component.scss',
  providers:[CommonService]
})
export class RolComponent implements OnInit{

    lstData:Rol[]
    req={
        index:0,
        limit:ROWS_DEFAULT
    }

    loading:boolean = false
    totalRegisters:number = ROWS_DEFAULT
    rowsOptions:any[] = ROWS_OPTIONS
    first:number = 0
    titleForm:string = 'Nuevo Rol'
    isDialog:boolean = false
    loadingSave:boolean = false
    submitted:boolean = false
    rol!:Rol
    formRol:FormGroup


    constructor(
        private rolService:RolService,
        private fb:FormBuilder,
        private commonService:CommonService,
        private confirmationService:ConfirmationService
    ){
        this.formRol = this.fb.group({
            name:['',Validators.required]
        })
    }

    ngOnInit(): void {
        this.getAll(this.req)
    }

    getAll(request:any){
        this.rolService.List(request).then((res:any) => {
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
        this.rol = {}
        this.submitted = false
    }

    save(item:Rol){
        this.submitted = true;
        let value = this.formRol.value

        for(let c in this.formRol.controls){
            this.formRol.controls[c].markAsTouched()
        }
        if(this.formRol.valid){
            this.loadingSave = true
            const req = {
                id:item.id ? item.id : 0,
                name:value.name
            }

            this.rolService.Save(req).then((res:any) => {
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

    edit(item:Rol){
        this.isDialog = true
        this.submitted = false
        this.rol = item
        this.titleForm = 'Editar Rol'
    }

    delete(event:Event,item:Rol){
        this.confirmationService.confirm({
            key:'deleteRol'+item.id,
            target:event.target || new EventTarget,
            message:'¿Desea eliminar el registro?',
            acceptLabel:'Si',
            icon:'pi pi-exclamation-triangle',
            accept:() => {
                this.rolService.Delete(item.id).then((res:any) => {
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
