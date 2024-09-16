import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared/shared.module';
import { CommonService } from '../../service/common.service';
import { Category } from '../../api/category';
import { ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../service/category.service';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-category',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './category.component.html',
    styleUrl: './category.component.scss',
    providers:[CommonService]
  })
  export class CategoryComponent implements OnInit{

      lstData:Category[]
      req={
          index:0,
          limit:ROWS_DEFAULT
      }

      loading:boolean = false
      totalRecords:number = ROWS_DEFAULT
      rowsOptions:any[] = ROWS_OPTIONS
      first:number = 0
      titleForm:string = 'Nueva categoria'
      isDialog:boolean = false
      loadingSave:boolean = false
      submitted:boolean = false
      category!:Category
      formCategory:FormGroup


      constructor(
          private categoryService:CategoryService,
          private fb:FormBuilder,
          private commonService:CommonService,
          private confirmationService:ConfirmationService
      ){
          this.formCategory = this.fb.group({
              name:['',Validators.required]
          })
      }

      ngOnInit(): void {
          this.getAll(this.req)
      }

      getAll(request:any){
          this.categoryService.List(request).then((res:any) => {
              if(res.isSuccess){
                  this.lstData = res.data
                  this.loading = false
                  this.totalRecords = res.total
                }
            })
        } catch (error) {
            console.log(error)

    }

      new(){
          this.isDialog = true
          this.category = {}
          this.submitted = false
      }

      save(item:Category){
          this.submitted = true;
          let value = this.formCategory.value

          for(let c in this.formCategory.controls){
              this.formCategory.controls[c].markAsTouched()
          }
          if(this.formCategory.valid){
              this.loadingSave = true
              const req = {
                  id:item.id ? item.id : 0,
                  name:value.name
              }

              this.categoryService.Save(req).then((res:any) => {
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

      edit(item:Category){
          this.isDialog = true
          this.submitted = false
          this.category = item
          this.titleForm = 'Editar categoria'
      }

      delete(event:Event,item:Category){
          this.confirmationService.confirm({
              key:'deleteCategory'+item.id,
              target:event.target || new EventTarget,
              message:'¿Desea eliminar el registro?',
              acceptLabel:'Si',
              icon:'pi pi-exclamation-triangle',
              accept:() => {
                  this.categoryService.Delete(item.id).then((res:any) => {
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
