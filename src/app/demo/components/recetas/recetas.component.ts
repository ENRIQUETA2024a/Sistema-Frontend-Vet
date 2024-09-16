import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared/shared.module';
import { CommonService } from '../../service/common.service';
import { ActivatedRoute } from '@angular/router';
import { Receta } from '../../api/receta';
import { ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecetasService } from '../../service/recetas.service';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-recetas',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './recetas.component.html',
    styleUrl: './recetas.component.scss',
    providers:[CommonService]
  })
  export class RecetasComponent implements OnInit{
      public route = inject(ActivatedRoute)
      id:string = this.route.snapshot.paramMap.get("id")

      lstData:Receta[]
      loading:boolean = false
      req = {
          index:0,
          limit:ROWS_DEFAULT,
          patient_id:this.id
      }
      totalRecords:number = ROWS_DEFAULT
      rowsOptions:number[] = ROWS_OPTIONS
      first:number = 0

      titleForm:string = 'Nueva receta'
      isDialog:boolean = false
      formReceta:FormGroup
      receta!:Receta
      submitted:boolean = false
      loadingSave:boolean = false
    datePipe: any;

      constructor(
          private recetasService:RecetasService,
          private fb:FormBuilder,
          private commonService:CommonService,
          private confirmationService:ConfirmationService
      ){
          this.formReceta = this.fb.group({
              description:['',[Validators.required]],
              indicaciones:['',[Validators.required]]
          })
      }

      ngOnInit(): void {
          this.getAll(this.req)
      }

      formatDate(date: Date | string): string {
        return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
    }

      getAll(request:any){
          try {
              this.recetasService.List(request).then((res:any) => {
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
          this.receta = {}
          this.submitted = false
      }

      save(item:Receta){
          this.submitted = true
          let value = this.formReceta.value
          for(let c in this.formReceta.controls){
              this.formReceta.controls[c].markAsTouched()
          }

          if(this.formReceta.valid){
              this.loadingSave = true
              const req = {
                  id:item.id ? item.id : 0,
                  description:value.description,
                  indicaciones:value.indicaciones,
                  patient_id:this.id
              }
              this.recetasService.Create(req).then((res:any) => {
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
      edit(item:Receta){
          this.isDialog = true
          this.receta = item
          this.titleForm = 'Editar Receta'
      }

      hideDialog(){
          this.isDialog = false
          this.submitted = false
          this.loadingSave = false
      }

      delete(event:Event,item:Receta){
          this.confirmationService.confirm({
              key:'deleteReceta'+item.id,
              target:event.target || new EventTarget,
              message:'¿Desea eliminar el registro?',
              acceptLabel:'Si',
              icon:'pi pi-exclamation-triangle',
              accept:()=>{
                  this.recetasService.Delete(item.id).then((res:any) => {
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

      pdf(item:Receta){
          try{
              this.recetasService.GeneratePDF(item.id).subscribe((res:Blob) => {
                  const url = window.URL.createObjectURL(res)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = `receta_medica_${item.patient}.pdf`
                  a.click()
                  window.URL.revokeObjectURL(url);
              })
          }catch(error){
              console.log(error);
          }
      }
      changePage(event:any){
          this.req.index = event.first
          this.req.limit = event.rows
          this.first = event.first
      }
  }
