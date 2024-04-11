export class Role{
    public id?:number;
    public roleName?:roleNameOptions;
    public isManagerial?:boolean;
    public startRoleDate?:Date;
    public workerId?:number;
}

export enum roleNameOptions{TEACHER=1, SECRETARY, PRINCIPLE, SUPERVISOR};