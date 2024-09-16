import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Client } from 'src/app/demo/api/client';
import { ROWS_ALL, ROWS_DEFAULT, ROWS_OPTIONS } from 'src/app/demo/api/config';
import { Venta } from 'src/app/demo/api/venta';
import { CommonService } from 'src/app/demo/service/common.service';
import { VentaService } from 'src/app/demo/service/venta.service';
import { SharedModule } from 'src/app/demo/shared/shared/shared.module';
import { ClientService } from '../../../service/client.service';

@Component({
  selector: 'app-listar-ventas',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './listar-ventas.component.html',
  styleUrl: './listar-ventas.component.scss',
  providers:[CommonService]
})
export class ListarVentasComponent implements OnInit {

    lstData: Venta[] = [];
    lstClient:Client[];

    req={
        index:0,
        limit:ROWS_DEFAULT
    }

    reqClients={
        index:0,
        limit:ROWS_ALL
    }

    loading:boolean = false
    totalRegisters:number = ROWS_DEFAULT
    rowsOptions:any[] = ROWS_OPTIONS
    first:number = 0
    titleForm:string = 'Nueva Venta'
    isDialog:boolean = false
    loadingSave:boolean = false
    submitted:boolean = false
    venta!:Venta
    formVenta:FormGroup

    datePipe: any;

    constructor(
        private ventaService: VentaService,
        private clientService:ClientService,
        private fb: FormBuilder,
        private commonService: CommonService,
        private confirmationService: ConfirmationService

    ) {
        this.formVenta = this.fb.group({
            id_venta: ['', [Validators.required]],
            id_producto: ['', [Validators.required]],
            id_servicio: ['', [Validators.required]],
            id_client: ['', [Validators.required]],
            cantidad: ['', [Validators.required]],
            precio: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {
        this.getVentas(this.req);
        this.ListClients()
    }

    formatDate(date: Date | string): string {
        return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
    }

    getVentas(request:any){
        try {
            this.ventaService.getAll(request).then((res:any) => {
                if(res.isSuccess){
                    this.lstData = res.data
                    this.loading = false
                    this.totalRegisters = res.total
                }
            })
        } catch (error) {
            console.log(error);

        }
    }


    ListClients(){
        try {
            this.clientService.getClients(this.reqClients).then((res:any) => {
                if(res.isSuccess){
                    this.lstClient = res.data.map(item => ({
                        value:item.id,
                        label:item.name
                    }))
                    this.loading = false
                }
            })
        } catch (error) {
            console.log(error);

        }
    }



  new(){
    this.isDialog = true
    this.venta = {}
    this.submitted = false
}

    save(item: any) {

    }

    edit(item:Venta){
        this.isDialog = true
        this.submitted = false
        this.venta = item
        this.titleForm = 'Editar Venta'
    }
    delete() {

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
        this.getVentas(this.req);
    }
}
