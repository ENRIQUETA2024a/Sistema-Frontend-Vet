import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ROWS_ALL, ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
import { User } from '../../api/user';
import { CommonService } from '../../service/common.service';
import { UserService } from '../../service/user.service';
import { SharedModule } from '../../shared/shared/shared.module';
import { RolService } from '../../service/rol.service';
import { EmployeeService } from '../../service/employee.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  providers:[CommonService]
})
export class UserComponent implements OnInit{

    req = {
        index:0,
        limit:ROWS_DEFAULT,
    }

    reqRoles = {
        index:0,
        limit:ROWS_ALL
    }

    reqEmployees = {
        index:0,
        limit:ROWS_ALL
    }

    lstUsers:User[] = []
    lstRoles:[] = []
    lstEmployees:[] = []
    first:number = 0;
    totalRecords:number=ROWS_DEFAULT;
    loading:boolean = false;
    rowsOptions:any[] = ROWS_OPTIONS;

    isUserDialog:boolean = false;
    submitted:boolean = false;
    titleForm:string = 'Crear usuario';
    loadingSave:boolean = false;


    formUser:FormGroup;

    user!:User;
    isEdit:boolean = false;
    searchUsername: string = '';

    constructor(
        private userService:UserService,
        private rolService:RolService,
        private employeeService:EmployeeService,
        private fb:FormBuilder,
        private commonService:CommonService,
        private confirmationService:ConfirmationService
    ){
        this.formUser = fb.group({
            username:['',[Validators.required]],
            password:['',[Validators.required]],
            employee_id:['',[Validators.required]],
            role_id:['',[Validators.required]]
        })
    }

    ngOnInit(): void {
        this.List(this.req);
        this.getEmployees()
        this.getRoles()
    }

    searchUsers() {
        this.loading = true;

        const request = {
          index: this.req.index,
          limit: this.req.limit,
          username: this.searchUsername
        };

        this.userService.searchUsers(request).then((res: any) => {
            console.log('Response Data:', res);
          if (res.isSuccess) {
            this.lstUsers = res.data;
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
        this.searchUsername = '';
        this.req = {
            index: 0,
            limit: ROWS_DEFAULT
        };
        this.List(this.req);
    }

    List(request:any){
        try {
            this.userService.getUsers(request).then((res:any) => {
                if(res.isSuccess){
                    this.lstUsers = res.data;
                    this.loading = false;
                    this.totalRecords = res.total;
                }
            })
        } catch (error) {
            console.error(error);

        }
    }

    getRoles(){
        this.rolService.List(this.reqRoles).then((res:any) => {
            if(res.isSuccess){
                this.lstRoles = res.data.map(item => ({
                    value:item.id,
                    label:item.name
                }))
                this.loading = false
            }
        })
    }

    getEmployees(){
        this.employeeService.List(this.reqEmployees).then((res:any) => {
            if(res.isSuccess){
                this.lstEmployees = res.data.map(item => ({
                    value:item.id,
                    label:item.names
                }))
                this.loading = false
            }
        })
    }


    changePage(event:any){
        this.req.index = event.first;
        this.req.limit = event.rows;
        this.first = event.first;
        this.List(this.req);
    }

    hideDialog(){
        this.isUserDialog = false;
        this.submitted = false;
        this.loadingSave = false;
        this.isEdit = false;
    }
    newUser(){
        this.isUserDialog = true;
        this.submitted = false;
        this.isEdit = false;
        this.user = {};

    }

    saveUser(item:User){
        this.submitted = true;

        let value = this.formUser.value;

        for(let c in this.formUser.controls){
            this.formUser.controls[c].markAsTouched();
        }
        if(this.formUser.valid){
            this.loadingSave = true;

            const currentEmployeeId = this.getCurrentEmployeeId();

            const req = {
                id:item.id ? item.id : 0,
                username:value.username,
                password:value.password,
                employee_id:value.employee_id,
                role_id:value.role_id,
                idEmployeeCreates: item.id ? null : currentEmployeeId,
                idEmployeeModifies: item.id ? currentEmployeeId : null,
                modifiedDate: item.id ? new Date() : null
            };

            this.userService.saveUser(req).then((res:any) => {

                this.loadingSave = false;
                if(!res.isSuccess){
                    this.commonService.handleError(res.messageException);
                }else{
                    this.commonService.handleSuccess()
                    this.isUserDialog = false;
                    this.List(this.req);
                }
            })
        }
    }

    getCurrentEmployeeId(): number | null {
        const user = JSON.parse(localStorage.getItem('user_vet') || '{}');
        return user?.employee_id || null;
      }


    editUser(item:User){
       this.titleForm = 'Editar Usuario';
       this.isUserDialog = true;
       this.user = item;
       this.isEdit = true;

       this.formUser = this.fb.group({
            username:['',[Validators.required]],
            password:[''],
            employee_id: [item.employee_id, [Validators.required]],
            role_id: [item.role_id, [Validators.required]],
        })
    }

    deleteUser(event: Event, item: User) {
        this.confirmationService.confirm({
            key: 'deleteUser' + item.id,
            target: event.target || new EventTarget,
            message: '¿Desea eliminar el registro?',
            acceptLabel: 'Sí',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const currentEmployeeId = this.getCurrentEmployeeId();
                const req = {
                    id: item.id,
                    idEmployeeDeletes: currentEmployeeId
                };

                this.userService.deleteUser(req).then((res: any) => {
                    if (!res.isSuccess) {
                        this.commonService.handleError(res.messageException);
                    } else {
                        this.commonService.handleDelete();
                        this.List(this.req);
                    }
                });
            }
        });
    }

}
