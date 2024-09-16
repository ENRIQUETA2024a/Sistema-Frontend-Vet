import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { UserComponent } from '../user/user.component';
import { SpecieComponent } from '../specie/specie.component';
import { BreedComponent } from '../breed/breed.component';
import { ClientComponent } from '../client/client.component';
import { PatientComponent } from '../patient/patient.component';
import { ConsultComponent } from '../consult/consult.component';
import { ExamsComponent } from '../exams/exams.component';
import { DiagnosesComponent } from '../diagnoses/diagnoses.component';
import { CategoryComponent } from '../category/category.component';
import { ProductComponent } from '../product/product.component';
import { TreatmentsComponent } from '../treatments/treatments.component';
import { CreateTreatmentComponent } from '../treatments/create/create/create.component';
import { RecetasComponent } from '../recetas/recetas.component';
import { RolComponent } from '../rol/rol.component';
import { EmployeeComponent } from '../employee/employee.component';
import { ServiceComponent } from '../service/service.component';
import { ListarVentasComponent } from '../ventas/listar-ventas/listar-ventas.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent },
        { path: 'user', component: UserComponent },
        { path: 'rol', component: RolComponent },
        { path: 'empleado', component: EmployeeComponent },
        { path: 'especie', component: SpecieComponent },
        { path: 'raza', component: BreedComponent },
        { path: 'cliente', component: ClientComponent },
        { path: 'client/:id/patient', component: PatientComponent },
        { path: 'patient/:id/consults', component: ConsultComponent },
        { path: 'consults/:id/exams', component: ExamsComponent },
        { path: 'consults/:id/diagnoses', component: DiagnosesComponent },
        { path: 'category', component: CategoryComponent },
        { path: 'producto', component: ProductComponent },
        { path: 'servicio', component: ServiceComponent },
        { path: 'diagnosis/:id/treatments', component: TreatmentsComponent },
        { path: 'diagnosis/:id/treatments/create', component: CreateTreatmentComponent },
        { path: 'diagnosis/:id/treatments/:treatment_id/edit', component: CreateTreatmentComponent },
        { path: 'patient/:id/recetas', component: RecetasComponent },
        { path: 'venta', component: ListarVentasComponent },
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
