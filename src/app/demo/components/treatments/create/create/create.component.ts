import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ROWS_ALL, ROWS_DEFAULT } from 'src/app/demo/api/config';
import { Product } from 'src/app/demo/api/product';
import { CommonService } from 'src/app/demo/service/common.service';
import { ProductService } from 'src/app/demo/service/product.service';
import { TreatmentService } from 'src/app/demo/service/treatment.service';
import { SharedModule } from 'src/app/demo/shared/shared/shared.module';

@Component({
    selector: 'app-create-treatment',
    standalone: true,
    imports: [SharedModule,RouterModule],
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss',
    providers:[CommonService]
  })
  export class CreateTreatmentComponent implements OnInit {
      private route = inject(ActivatedRoute)
      id:string=this.route.snapshot.paramMap.get("id") //diagnostico id
      treatment_id:string = this.route.snapshot.paramMap.get("treatment_id")

      reqProducts = {
          index:0,
          limit:ROWS_ALL
      }
      reqTreatment = {
          index:0,
          limit:ROWS_DEFAULT,
          treatment_id:this.treatment_id
      }
      lstProductos:Product[]
      loading:boolean = false
      loadingSave:boolean = false
      selectedProducts = []
      submitted:boolean = false
      formProducts:FormGroup
      detail:string

      constructor(
          private productService:ProductService,
          private fb:FormBuilder,
          private confirmationService:ConfirmationService,
          private treatmentService:TreatmentService,
          private commonService:CommonService,
          private router:Router
      ){
          this.formProducts = this.fb.group({
              detail:['',[Validators.required]],
              products:['']
          })
      }

      ngOnInit(): void {
          this.getProducts()
          if(this.treatment_id != undefined && this.treatment_id != "" && this.treatment_id != null){
              this.detailTreatment()
          }
      }

      getProducts(){
          this.productService.List(this.reqProducts).then((res:any) => {
              if(res.isSuccess){
                  this.loading = false
                  this.lstProductos = res.data.map(item => ({
                      product_id:item.id,
                      label:item.name,
                      treatment_id:0
                  }))
              }
          })
      }

      detailTreatment() {
        this.treatmentService.detail(this.reqTreatment).then((res: any) => {
            if (res.res.isSuccess) {
                this.loading = false;
                this.formProducts.patchValue({
                    detail: res.res.item.detail

                });
            }
            if (res.products.isSuccess) {
                this.selectedProducts = res.products.data.map(item => ({
                    label: item.name,
                    product_id: item.product_id
                }));
            }
        });
    }
      addProduct(){
          let value = this.formProducts.value

          for(let c in this.formProducts.controls){
              this.formProducts.controls[c].markAsTouched()
          }
          if(value.products != ""){
              let productSelected = value.products
              let products = this.lstProductos.find((item:any) => item.product_id == productSelected)
              let existProduct = this.selectedProducts.find((item:any) => item.product_id == productSelected)
              if(existProduct == undefined){
                  this.selectedProducts.push(products)
              }
          }
      }

      save(){
          this.submitted = true
          let value = this.formProducts.value

          for(let c in this.formProducts.controls){
              this.formProducts.controls[c].markAsTouched()
          }
          if(this.formProducts.valid){
              this.loadingSave = false
              const req = {
                  id:this.treatment_id != null ? this.treatment_id : 0,
                  diagnosis_id:this.id,
                  detail:value.detail,
                  products:this.selectedProducts
              }
              this.treatmentService.create(req).then((res:any) => {
                  if(res.isSuccess){
                      this.commonService.handleSuccess()
                      setTimeout(() => {
                          this.router.navigate(["diagnosis",this.id,"treatments"])
                      }, 2000);
                  }
              })
          }
      }

      delete(event,item:any){
          this.confirmationService.confirm({
              key:'deleteCreateProductTratamiento'+item.product_id,
              target:event.target || new EventTarget,
              message:'Â¿Desea eliminar el producto?',
              acceptLabel:'Si',
              icon:'pi pi-exclamation-triangle',
              accept:()=>{
                  console.log(item);

                  console.log(this.selectedProducts);

                  this.selectedProducts = this.selectedProducts.filter((product:any) => product.product_id != item.product_id)
              }
          })
      }
  }



