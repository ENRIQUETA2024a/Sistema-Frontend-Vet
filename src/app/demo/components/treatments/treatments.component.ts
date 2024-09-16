import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared/shared.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonService } from '../../service/common.service';
import { ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
import { ConfirmationService } from 'primeng/api';
import { Treatment } from '../../api/treatment';
import { TreatmentService } from '../../service/treatment.service';

@Component({
    selector: 'app-treatments',
    standalone: true,
    imports: [SharedModule,RouterModule],
    templateUrl: './treatments.component.html',
    styleUrl: './treatments.component.scss',
    providers:[CommonService]
  })
  export class TreatmentsComponent implements OnInit{
      private route = inject(ActivatedRoute)
      id:string = this.route.snapshot.paramMap.get("id") //id diagnostico

      req = {
          index:0,
          limit:ROWS_DEFAULT,
          diagnosis_id:this.id
      }

      lstData:Treatment[]
      loading:boolean = false
      totalRecords:number = ROWS_DEFAULT
      rowsOptions:number[] = ROWS_OPTIONS
      first:number = 0

      constructor(
          private treatmentService:TreatmentService,
          private router:Router,
          private commonService:CommonService,
          private confirmationService:ConfirmationService
      ){}

      ngOnInit(): void {
          this.List(this.req)

      }

      List(request){
          try {
              this.treatmentService.List(request).then((res:any) => {
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
      edit(item:Treatment){
          this.router.navigate(["/diagnosis",this.id,"treatments",item.id,"edit"])
      }

      delete(event:Event,item:Treatment){
        this.confirmationService.confirm({
            key:'deleteTratamiento'+item.id,
            target:event.target || new EventTarget,
            message:'¿Desea eliminar el registro?',
            acceptLabel:'Si',
            icon:'pi pi-exclamation-triangle',
            accept:() => {
                this.treatmentService.delete(item.id).then((res:any) => {
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


      changePage(event:any){
          this.req.index = event.first
          this.req.limit = event.rows
          this.first = event.first
          this.List(this.req);
      }
  }
