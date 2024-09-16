import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared/shared.module';
import { Specie } from '../../api/specie';
import { ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
import { SpecieService } from '../../service/specie.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../service/common.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-specie',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './specie.component.html',
  styleUrl: './specie.component.scss',
  providers:[CommonService]
})
export class SpecieComponent implements OnInit {

    req = {
        index:0,
        limit:ROWS_DEFAULT
    }

    lstSpecies:Specie[];
    loading:boolean;
    first:number = 0;
    totalRecords:number = ROWS_DEFAULT;
    rowsOptions:any[] = ROWS_OPTIONS;

    formSpecie:FormGroup;
    isSpecieDialog:boolean = false;
    submitted:boolean = false;
    titleForm:string = 'Nueva especie';
    loadingSave:boolean = false;

    specie!:Specie;
    searchSpeciename: string = '';

    constructor(
        private specieService:SpecieService,
        private fb:FormBuilder,
        private commonService:CommonService,
        private confirmationService:ConfirmationService
    ){
        this.formSpecie = this.fb.group({
            name:['',[Validators.required, Validators.pattern(/^[A-Za-z\s\xF1\xD1áéíóúÁÉÍÓÚüÜ]+$/)]],
            scientificName:['',[Validators.required, Validators.pattern(/^[A-Za-z\s\xF1\xD1áéíóúÁÉÍÓÚüÜ]+$/)]],

        })
    }

    ngOnInit(): void {
        this.List(this.req)
    }

    searchSpecies() {
        this.loading = true;

        const request = {
          index: this.req.index,
          limit: this.req.limit,
          name: this.searchSpeciename
        };

        this.specieService.searchSpecies(request).then((res: any) => {
          if (res.isSuccess) {
            this.lstSpecies = res.data;
            this.totalRecords = res.total;
          } else {
            this.commonService.noResultsMessage(res.messageException);
          }
          this.loading = false;
        }).catch((error) => {
          console.error('Error:', error);
          this.loading = false;
        });
      }

      clearSearch() {
        this.searchSpeciename = '';
        this.req = {
            index: 0,
            limit: ROWS_DEFAULT
        };
        this.List(this.req);
    }


    List(request:any){
        try {
            this.specieService.getSpecies(request).then((res:any) => {
                if(res.isSuccess){
                    this.lstSpecies = res.data
                    this.loading = false
                    this.totalRecords = res.total
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    newSpecie(){
        this.isSpecieDialog = true;
        this.submitted = false;
        this.specie = {}
    }

    hideDialog(){
        this.isSpecieDialog = false;
        this.submitted = false;
        this.loadingSave = false;
    }

    save(item:Specie){
        this.submitted = true;
        let value = this.formSpecie.value;

        for(let c in this.formSpecie.controls){
            this.formSpecie.controls[c].markAsTouched()
        }

        if(this.formSpecie.valid){
            this.loadingSave = true
            const req = {
                id:item.id ? item.id : 0,
                name:value.name,
                scientificName:value.scientificName
            }

            this.specieService.saveSpecie(req).then((res:any) => {
                this.loadingSave = false;
                if(!res.isSuccess){
                    this.commonService.handleError(res.messageException)
                }else{
                    this.commonService.handleSuccess()
                    this.List(this.req)
                }
                this.hideDialog()
            })
        }
    }

    editSpecie(item:Specie){
        this.titleForm = 'Editar Esepcie'
        this.isSpecieDialog = true;
        this.specie = item
    }

    deleteSpecie(event:Event,item:Specie){
        this.confirmationService.confirm({
            key:'deleteSpecie'+item.id,
            target:event.target || new EventTarget,
            message:'¿Desea eliminar el registro?',
            acceptLabel:'Si',
            icon:'pi pi-exclamation-triangle',
            accept:() => {
                this.specieService.delete(item.id).then((res:any) => {
                    if(!res.isSuccess){
                        this.commonService.handleError(res.messageException)
                    }{
                        this.commonService.handleDelete()
                        this.List(this.req)
                    }

                })
            }
        })
    }
    changePage(event:any){
        this.req.index = event.first;
        this.req.limit = event.rows;
        this.first = event.first;
        this.List(this.req);
    }
}
