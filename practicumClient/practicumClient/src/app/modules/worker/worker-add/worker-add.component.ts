import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { WorkerService } from '../../../services/worker.service';
import { Worker } from '../../../models/worker.model';
import { genderType } from '../../../models/worker.model';
import { Router, Routes } from '@angular/router';
import { RoleAddComponent } from '../../role/role-add/role-add.component';
import { WorkerListComponent } from '../worker-list/worker-list.component';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core'
import { RoleService } from '../../../services/role.service';
import { Role, roleNameOptions } from '../../../models/role.model';

const routes: Routes = [
  { path: "roleAdd", component: RoleAddComponent },
  { path: "workerList", component: WorkerListComponent }
];

@Component({
  selector: 'app-worker-add',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, NgbModalModule, RoleAddComponent],
  templateUrl: './worker-add.component.html',
  styleUrl: './worker-add.component.css',
  providers: [HttpClient, HttpClientModule]
})

export class WorkerAddComponent {

  @ViewChild('addRolesContainer', { read: ViewContainerRef })
  addRolesContainer!: ViewContainerRef;
  workerToAdd: Worker = new Worker;
  genderType = genderType;
  roleNameOptions = roleNameOptions;
  @Input() name!: string;
  openAddRoles: boolean = false;
  roleToAdd: Role = new Role;
  rolesToAddToWorker: Role[] = [];
  rolesToCheck!: string[];
  @Output() onPostCreate = new EventEmitter<any>();

  addWorkerForm: FormGroup = new FormGroup({
    "idNumber": new FormControl("", [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
    "firstName": new FormControl("", [Validators.required, Validators.minLength(2)]),
    "lastName": new FormControl("", [Validators.required, Validators.minLength(2)]),
    "password": new FormControl("", [Validators.required, Validators.minLength(2)]),
    "startDate": new FormControl("", [Validators.required]),
    "dateOfBirth": new FormControl("", [Validators.required]),
    "gender": new FormControl("", [Validators.required])
  })

  constructor(private _workerService: WorkerService, private _rotuer: Router,
    private _modalService: NgbActiveModal, private resolver: ComponentFactoryResolver,
    private _roleService: RoleService) { }


  addWorker() {debugger;
    this.workerToAdd = this.addWorkerForm.value;
    this.workerToAdd.gender = Number(this.genderType[this.workerToAdd.gender!]);
    this.workerToAdd.startDate = new Date(this.workerToAdd.startDate!);
    this.workerToAdd.dateOfBirth = new Date(this.workerToAdd.dateOfBirth!);
    this.workerToAdd.idNumber = Number(this.workerToAdd.idNumber!);
  
    this.rolesToAddToWorker.forEach(role => {
      let clearName = role.roleName!;
      role.roleName = Number(roleNameOptions[clearName]);
      role.isManagerial = true;
      role.workerId = Number(this.workerToAdd.idNumber);
    });
  
    this.addWorkerAndRoles();
  
    this.closeForm();
  }
  

  addWorkerAndRoles(): void {
    this._workerService.postWorker(this.workerToAdd).subscribe(res => {
      console.log("Worker added successfully", res);
      this.workerToAdd.id = res.id;
      this.addRoles(this.workerToAdd.id!);
    });
  }
  

addRoles(workerId: number): void {
    this._roleService.postRoles(workerId, this.rolesToAddToWorker).subscribe(res => {
        console.log("Roles added successfully", res);
        this._modalService.dismiss();
        this.onPostCreate.emit();
    });
}


  getGenderKeys() {
    const genderKeys = Object.keys(this.genderType);
    const stringGenderKeys = genderKeys.filter(key => isNaN(Number(key)));
    return stringGenderKeys;
  }

  getRoleNameOptionsKeys() {
    const roleNameOptions = Object.keys(this.roleNameOptions);
    const stringOptions = roleNameOptions.filter(key => isNaN(Number(key)));
    return stringOptions;
  }

  cancelAddRole() {
    this._rotuer.navigate(['/workerList']);
  }

  homePage() {
    this._rotuer.navigate(['/workerList']);
  }

  saveDetails() {
    this.closeForm();
  }

  closeForm() {
    this._modalService.dismiss();
  }

  showAddRolesComponent() {
    this.addRolesContainer!.clear();
    const factory = this.resolver.resolveComponentFactory(RoleAddComponent);
    sessionStorage.setItem('startDate', this.addWorkerForm.value.startDate.toString());
    const componentRef = this.addRolesContainer!.createComponent(factory);
    componentRef.instance.roleAdded.subscribe((role) => {
      this.rolesToAddToWorker.push(role);
    });
  }
}