import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ImageModule } from 'primeng/image';
import { CalendarModule } from 'primeng/calendar';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports:[
    TableModule,
    PaginatorModule,
    PanelModule,
    CommonModule,
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    ToastModule,
    TooltipModule,
    ConfirmPopupModule,
    ImageModule,
    CalendarModule,
    
  ],
  providers:[
    MessageService,
    ConfirmationService
  ]
})
export class SharedModule { }
