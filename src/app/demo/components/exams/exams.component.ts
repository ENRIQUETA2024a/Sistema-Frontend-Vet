import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared/shared.module';
import { CommonService } from '../../service/common.service';
import { ActivatedRoute } from '@angular/router';
import { ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
import { Exam } from '../../api/exam';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ExamService } from '../../service/exam.service';

@Component({
    selector: 'app-exams',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './exams.component.html',
    styleUrl: './exams.component.scss',
    providers:[CommonService]
  })
  export class ExamsComponent implements OnInit{
      private route = inject(ActivatedRoute)
      id:string = this.route.snapshot.paramMap.get("id")

      req = {
          index:0,
          limit:ROWS_DEFAULT,
          consult_id:this.id
      }

      lstData:Exam[];
      loading:boolean = false
      totalRecords:number = ROWS_DEFAULT
      rowsOptions:number[] = ROWS_OPTIONS
      first:number = 0
      titleForm:string = 'Nuevo examen'
      isDialog:boolean = false
      loadingSave:boolean = false
      submitted:boolean = false

      exam!:Exam;
      formExam:FormGroup;

      constructor(
          private examService:ExamService,
          private fb:FormBuilder,
          private commonService:CommonService,
          private confirmationService:ConfirmationService
      ){
          this.formExam = this.fb.group({
              mucosa:[''],
              piel:[''],
              conjuntival:[''],
              oral:[''],
              sis_reproductor:[''],
              rectal:[''],
              ojos:[''],
              nodulos_linfaticos:[''],
              locomocion:[''],
              sis_cardiovascular:[''],
              sis_respiratorio:[''],
              sis_digestivo:[''],
              sis_urinario:[''],
          })
      }
      ngOnInit(): void {
          this.getExams(this.req)
      }

      getExams(request:any){
          try {
              this.examService.List(request).then((res:any) => {
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
          this.exam = {}
      }

      save(item:Exam){
          this.submitted = true
          let value = this.formExam.value
          for(let c in this.formExam.controls){
              this.formExam.controls[c].markAsTouched()
          }
          if(this.formExam.valid){
              this.loadingSave = true
              const req = {
                  id:item.id ? item.id : 0,
                  mucosa:value.mucosa,
                  piel:value.piel,
                  conjuntival:value.conjuntival,
                  oral:value.oral,
                  sis_reproductor:value.sis_reproductor,
                  rectal:value.rectal,
                  ojos:value.ojos,
                  nodulos_linfaticos:value.nodulos_linfaticos,
                  locomocion:value.locomocion,
                  sis_cardiovascular:value.sis_cardiovascular,
                  sis_respiratorio:value.sis_respiratorio,
                  sis_digestivo:value.sis_digestivo,
                  sis_urinario:value.sis_urinario,
                  consult_id:this.id
              }

              this.examService.Save(req).then((res:any) => {
                  if(res.isSuccess){
                      this.commonService.handleSuccess()
                      this.getExams(this.req)
                  }else{
                      this.commonService.handleError(res.messageException)
                  }
              })
              this.hideDialog()
          }
      }

      edit(item:Exam){
          this.isDialog = true
          this.submitted = false
          this.exam = item
          this.titleForm = 'Editar examen'
      }

      delete(event:Event,item:Exam){
          this.confirmationService.confirm({
              key:'deleteExam'+item.id,
              target:event.target || new EventTarget,
              message:'¿Desea eliminar el registro?',
              acceptLabel:'Si',
              icon:'pi pi-exclamation-triangle',
              accept:() => {
                  this.examService.Delete(item.id).then((res:any) => {
                      if(res.isSuccess){
                          this.commonService.handleDelete()
                          this.getExams(this.req)
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
          this.getExams(this.req);
      }
  }
