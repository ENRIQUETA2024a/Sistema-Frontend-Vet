import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Dashboard } from '../../api/dashboard';
import { DashboardService } from '../../service/dashboard.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    subscription!: Subscription;

    options: any;

    dashboard: Dashboard = {
        clientes: 0,
        pacientes: 0,
        recetas: 0,
        ventas: 0
    };

    constructor(public layoutService: LayoutService, private dashboardService: DashboardService) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe(() => {
                // Llama a initChart aquí si es necesario
            });
    }

    ngOnInit() {
        this.dashboardInfo();


    }

    dashboardInfo() {
        this.dashboardService.DashboardInfo().then((res: any) => {
            if (res.isSuccess) {
                this.dashboard = res.item;
            }
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
