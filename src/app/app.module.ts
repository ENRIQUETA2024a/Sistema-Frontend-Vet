import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { SharedModule } from 'primeng/api';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './demo/service/auth-interceptor.service';
import { FullCalendarModule } from '@fullcalendar/angular';


@NgModule({
    declarations: [AppComponent],
    imports: [
        AppRoutingModule,
        HttpClientModule,
        AppLayoutModule,
        SharedModule,
        FullCalendarModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService,

        {
            provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true
        }

    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
