import { Data } from "@angular/router";
import { Role } from "./role.model";

export class Worker {
    public id?: number;
    public idNumber?: number;
    public password?:string;
    public firstName?: string;
    public lastName?: string;
    public startDate?: Date;
    public dateOfBirth?: Date;
    public gender?: genderType;
    public status?: boolean;
    public roles?: Role[];
}

export enum genderType { MALE=1 ,FEMALE };