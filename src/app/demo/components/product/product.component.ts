import { Component,  Inject,  LOCALE_ID,  OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared/shared.module';
import { CommonService } from '../../service/common.service';
import { Product } from '../../api/product';
import { Category } from '../../api/category';
import { ROWS_ALL, ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { CategoryService } from '../../service/category.service';
import { ProductService } from '../../service/product.service';
import { DecimalPipe, formatDate } from '@angular/common';

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './product.component.html',
    styleUrl: './product.component.scss',
    providers:[CommonService, DecimalPipe]
  })
  export class ProductComponent implements OnInit {

      req = {
          index: 0,
          limit: ROWS_DEFAULT
      }

      reqCategories = {
          index:0,
          limit:ROWS_ALL
      }

      

      totalRecords:number = ROWS_DEFAULT
      rowsOptions:number[] = ROWS_OPTIONS
      first:number = 0
      titleForm:string = 'Nuevo producto'
      lstData:Product[] = []
      lstCategories:Category[] = []
      loading:boolean = false;
      isDialog:boolean = false;
      formProduct:FormGroup;
      product!:Product
      submitted:boolean = false
      loadingSave:boolean = false
      file!:File
      datePipe: any;

      constructor(
          private productService:ProductService,
          private categoryService:CategoryService,

          private fb:FormBuilder,
          private commonService:CommonService,
          private confirmationService:ConfirmationService,
          @Inject(LOCALE_ID) public locale:string,
          private decimalPipe: DecimalPipe
      ){
          this.formProduct = this.fb.group({
              name:['',[Validators.required]],
              category_id:['',[Validators.required]],
              laboratory:['',[Validators.required]],
              expirationDate:['',],
              cost:['',[Validators.required]],
              price:['',[Validators.required]],
              stock:['',[Validators.required]],
              photo:['']
          })
      }

      ngOnInit(): void {
          this.getCategories()
          this.getProducts(this.req)
      }

      formatDate(date: Date | string): string {
        return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
    }

    formatDecimal(value: number): string {
        return this.decimalPipe.transform(value, '1.2-2') || '0.00';
    }

      getProducts(request:any){
          try {
              this.productService.List(request).then((res:any) => {
                  if(res.isSuccess){
                      this.loading = false
                      this.lstData = res.data
                      this.totalRecords = res.total;
                  }
              })
          } catch (error) {
              console.log(error);

          }
      }

      getCategories(){
          this.categoryService.List(this.reqCategories).then((res:any) => {
              if(res.isSuccess){
                  this.lstCategories = res.data.map(item => ({
                      value:item.id,
                      label:item.name
                  }))
                  this.loading = false
              }
          })
      }

      new(){
          this.isDialog = true
          this.submitted = false
          this.product = {}
      }

      onFileChange(event:any){
          this.file = event.target.files[0]
      }

      save(item:Product){
          this.submitted = false
          let value = this.formProduct.value

          for(let c in this.formProduct.controls){
              this.formProduct.controls[c].markAsTouched()
          }

          if(this.formProduct.valid){
              this.loadingSave = true
              const req = {
                  id:item.id ? item.id : 0,
                  name:value.name,
                  category_id:value.category_id,
                  laboratory:value.laboratory,
                  expirationDate:formatDate(value.expirationDate,'dd/MM/yyyy',this.locale),
                  cost: value.cost,
                  price: value.price,
                  stock:value.stock,
                  idEmployeeCreates: item.id ,
                  idEmployeeModifies: item.id ,
                  modifiedDate: item.id ? new Date() : null,
                   photo:this.file != undefined ? this.file : ""
              }
              this.productService.Save(req).then((res:any) => {
                  this.loadingSave = false
                  if(res.isSuccess){
                      this.commonService.handleSuccess()
                      this.getProducts(this.req)
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


      edit(item:Product){
          this.product = { ...item };
          this.titleForm = 'Editar producto';
          this.isDialog = true;
          this.submitted = false;


      }

      delete(event:Event,item:Product){
          this.confirmationService.confirm({
              key:'deleteProduct'+item.id,
              target:event.target || new EventTarget,
              message:'¿Desea eliminar el registro?',
              acceptLabel:'Si',
              icon:'pi pi-exclamation-triangle',
              accept:() => {

                const currentEmployeeId = this.getCurrentEmployeeId();
                const req = {
                    id: item.id,
                    idEmployeeDeletes: currentEmployeeId
                };

                  this.productService.Delete(item.id).then((res:any) => {
                      if(res.isSuccess){
                          this.commonService.handleDelete()
                          this.getProducts(this.req)
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
          this.getProducts(this.req);
      }
  }

