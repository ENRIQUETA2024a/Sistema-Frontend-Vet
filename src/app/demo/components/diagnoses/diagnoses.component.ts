import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared/shared.module';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonService } from '../../service/common.service';
import { ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
import { Diagnosis } from '../../api/diagnosis';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DiagnosisService } from '../../service/diagnosis.service';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-diagnoses',
    standalone: true,
    imports: [SharedModule,RouterModule],
    templateUrl: './diagnoses.component.html',
    styleUrl: './diagnoses.component.scss',
    providers:[CommonService]
  })
  export class DiagnosesComponent implements OnInit{
      private route = inject(ActivatedRoute)
      id:string = this.route.snapshot.paramMap.get("id")

      req={
          index:0,
          limit:ROWS_DEFAULT,
          consult_id:this.id
      }

      lstData: Diagnosis[]
      loading:boolean = false
      totalRecords:number = ROWS_DEFAULT
      rowsOptions:number[] = ROWS_OPTIONS
      first:number = 0
      titleForm:string = 'Nuevo diagnostico'
      isDialog:boolean = false
      loadingSave:boolean = false
      submitted:boolean = false

      diagnosis!:Diagnosis;
      formDiagnosis:FormGroup
    datePipe: any;

      constructor(
          private diagnosisService:DiagnosisService,
          private fb:FormBuilder,
          private commonService:CommonService,
          private confirmationService:ConfirmationService
      ){
          this.formDiagnosis = this.fb.group({
              detail:['',Validators.required],
              date_diagnosis:['']
          })
      }
      ngOnInit(): void {
          this.getDiagnosis(this.req)
      }

      formatDate(date: Date | string): string {
        return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
    }

      getDiagnosis(request:any){
          try {
              this.diagnosisService.List(request).then((res:any) => {
                  if(res.isSuccess){
                      this.lstData = res.data
                      this.loading = false
                      this.totalRecords = res.total
                  }
              })
          } catch (error) {
              console.log(error);

          }
      }

      new(){
          this.isDialog = true
          this.submitted = false
          this.diagnosis = {}
      }

      save(item:Diagnosis){
          this.submitted = true
          let value = this.formDiagnosis.value

          for(let c in this.formDiagnosis.controls){
              this.formDiagnosis.controls[c].markAsTouched()
          }

          if(this.formDiagnosis.valid){
              this.loadingSave = true

              const req = {
                  id:item.id ? item.id : 0,
                  detail:value.detail,
                  date_diagnosis:new Date(value.date_diagnosis).toISOString(),
                  consult_id:this.id
              }

              this.diagnosisService.Save(req).then((res:any) =>{
                  if(res.isSuccess){
                      this.commonService.handleSuccess()
                      this.getDiagnosis(this.req)
                  }else{
                      this.commonService.handleError(res.messageException)
                  }
              })

              this.hideDialog()
          }
      }

      edit(item:Diagnosis){
          this.isDialog = true
          this.submitted = false
          this.diagnosis = item;
      }


      delete(event:Event,item:Diagnosis){
          this.confirmationService.confirm({
              key:'deleteDiagnosis'+item.id,
              target:event.target || new EventTarget,
              message:'¿Desea eliminar el registro?',
              acceptLabel:'Si',
              icon:'pi pi-exclamation-triangle',
              accept:() => {
                  this.diagnosisService.Delete(item.id).then((res:any) => {
                      if(res.isSuccess){
                          this.commonService.handleDelete()
                          this.getDiagnosis(this.req)
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
          this.getDiagnosis(this.req);
      }
  }

