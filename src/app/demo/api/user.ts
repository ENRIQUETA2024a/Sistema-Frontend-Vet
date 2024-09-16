export interface User{
    id?:number,
    username?:string,
    password?: string,
    role_id?:number,
    role_name?:string,
    employee_id?:number,
    employee_names?:string,
    totalRegisters?:number,
    modifiedDate?: Date;
}
