import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['user'] },
                    { label: 'Roles', icon: 'pi pi-fw pi-key', routerLink: ['rol'] },
                    { label: 'Empleados', icon: 'pi pi-fw pi-id-card', routerLink: ['empleado'] },
                    { label: 'Especies',  icon: 'pi pi-fw pi-globe', routerLink: ['especie'] },
                    { label: 'Razas', icon: 'pi pi-fw pi-info-circle', routerLink: ['raza'] },
                    { label: 'Clientes', icon: 'pi pi-fw pi-id-card', routerLink: ['cliente'] },
                    { label: 'Categorias', icon: 'pi pi-fw pi-bookmark', routerLink: ['category'] },
                    { label: 'Productos', icon: 'pi pi-fw pi-tags', routerLink: ['producto'] },
                    { label: 'Servicios', icon: 'pi pi-fw pi-briefcase', routerLink: ['servicio'] },
                    { label: 'Ventas', icon: 'pi pi-fw pi-briefcase', routerLink: ['venta'] },

                ]
            },

        ];
    }
}
