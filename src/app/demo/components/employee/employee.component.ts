import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared/shared.module';
import { CommonService } from '../../service/common.service';
import { Employee } from '../../api/employee';
import { DOCUMENT_TYPE, ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../service/employee.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
  providers:[CommonService]
})
export class EmployeeComponent implements OnInit{

    lstData:Employee[]
    req={
        index:0,
        limit:ROWS_DEFAULT
    }

    loading:boolean = false
    totalRegisters:number = ROWS_DEFAULT
    rowsOptions:any[] = ROWS_OPTIONS
    first:number = 0
    titleForm:string = 'Nuevo Empleado'
    isDialog:boolean = false
    loadingSave:boolean = false
    submitted:boolean = false
    employee!:Employee
    formEmployee:FormGroup

    documents:any[] = DOCUMENT_TYPE
    datePipe: any;


    constructor(
        private employeeService:EmployeeService,
        private fb:FormBuilder,
        private commonService:CommonService,
        private confirmationService:ConfirmationService
    ){
        this.formEmployee = this.fb.group({
            documentType:['',[Validators.required,]],
            documentNumber:['',[Validators.required,Validators.minLength(8),Validators.maxLength(12)]],
            names:['',[Validators.required, Validators.pattern(/^[A-Za-z\s\xF1\xD1áéíóúÁÉÍÓÚüÜ]+$/)]],
            lastNames:['',[Validators.required, Validators.pattern(/^[A-Za-z\s\xF1\xD1áéíóúÁÉÍÓÚüÜ]+$/)]],
            dateBirth:['',],
            address:[''],
            city:[''],
            email:['',[Validators.email]],
            phone:['',[Validators.required, Validators.pattern(/^([0-9])*$/),Validators.maxLength(9), Validators.minLength(5),]],
            cargo:['']
        })
    }

    ngOnInit(): void {
        this.getAll(this.req)
    }

    formatDate(date: Date | string): string {
        return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
    }

    getAll(request:any){
        this.employeeService.List(request).then((res:any) => {
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
        this.employee = {}
        this.submitted = false
    }

    save(item:Employee){
        this.submitted = true;
        let value = this.formEmployee.value

        for(let c in this.formEmployee.controls){
            this.formEmployee.controls[c].markAsTouched()
        }
        if(this.formEmployee.valid){
            this.loadingSave = true
            const req = {
                id:item.id ? item.id : 0,
                documentType:value.documentType,
                documentNumber:value.documentNumber,
                names:value.names,
                lastNames:value.lastNames,
                dateBirth:value.dateBirth,
                address:value.address,
                city:value.city,
                email:value.email,
                phone:value.phone,
                cargo:value.cargo

            }

            this.employeeService.Save(req).then((res:any) => {
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

    edit(item:Employee){
        this.isDialog = true
        this.submitted = false
        this.employee = item
        this.titleForm = 'Editar Empleado'


    }

    delete(event:Event,item:Employee){
        this.confirmationService.confirm({
            key:'deleteEmployee'+item.id,
            target:event.target || new EventTarget,
            message:'¿Desea eliminar el registro?',
            acceptLabel:'Si',
            icon:'pi pi-exclamation-triangle',
            accept:() => {
                this.employeeService.Delete(item.id).then((res:any) => {
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

