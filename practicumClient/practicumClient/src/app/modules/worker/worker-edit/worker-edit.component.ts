import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { WorkerListComponent } from '../worker-list/worker-list.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Worker, genderType } from '../../../models/worker.model';
import { WorkerService } from '../../../services/worker.service';
import { Role, roleNameOptions } from '../../../models/role.model';
import { RoleService } from '../../../services/role.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  { path: "workerList", component: WorkerListComponent }
];

@Component({
  selector: 'app-worker-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './worker-edit.component.html',
  styleUrl: './worker-edit.component.css'
})

export class WorkerEditComponent {
  @ViewChild('myModal') myModal!: ElementRef;
  editRolesContainer!: ViewContainerRef;

  genderType = genderType;
  roleNameOptions = roleNameOptions;
  workerToUpdate: Worker = JSON.parse(localStorage['worker']);
  IsEditRole: boolean = false;
  workerRoles: Role[] = [];
  workerRolesNumber: boolean[] = Array(4).fill(false);
  roleToSend: Role = new Role();
  isRoleAdd: boolean = false;
  isRoleEdit: boolean = false;


  constructor(private _workerService: WorkerService, private _router: Router, private _roleService: RoleService, public _modalService: NgbActiveModal) {
    this.editWorkerForm.patchValue(this.workerToUpdate);
    this.editWorkerForm.value.gender = localStorage.getItem('gender');
  }

  @ViewChild('invalidValuesModal') invalidValuesModal: any;


  ngOnInit() {
    this.updateButtons();
  }


  updateButtons() {
    this._roleService.getRolesByWorkerId(this.workerToUpdate.id!).subscribe(
      roles => {
        sessionStorage.setItem('rolesToWorker', JSON.stringify(roles));
      },
      error => console.log(error)
    );
    this.workerRoles = JSON.parse(sessionStorage.getItem('rolesToWorker')!)
    console.log(this.workerRoles, "workerRoles");
    this.workerRoles.forEach((role) => {
      this.workerRolesNumber[role.roleName! - 1] = true;
    });
    console.log("in update buttons");
    console.log(this.workerRolesNumber, "workerrolenumber");
  }


  editWorkerForm: FormGroup = new FormGroup({
    "idNumber": new FormControl("", [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
    "firstName": new FormControl("", [Validators.required, Validators.minLength(2)]),
    "lastName": new FormControl("", [Validators.required, Validators.minLength(2)]),
    "password": new FormControl("", [Validators.required, Validators.minLength(2)]),
    "startDate": new FormControl("", [Validators.required]),
    "dateOfBirth": new FormControl("", [Validators.required]),
    "gender": new FormControl("", [Validators.required]),
    "roles": new FormControl("")
  });


  editRoleForm: FormGroup = new FormGroup({
    "roleName": new FormControl(""),
    "isManagerial": new FormControl("", [Validators.required, this.validateIsManagerial.bind(this)]),
    "startRoleDate": new FormControl("", [Validators.required, this.validateStartRoleDate.bind(this)]),
    "workerId": new FormControl(localStorage.getItem("workerId")!)
  })


  validateIsManagerial(control: FormControl): { [key: string]: any } | null {
    const isManagerial = control.value;
    if (isManagerial === true || isManagerial === false) {
      return null;
    } else {
      return { 'invalidIsManagerial': true };
    }
  }


  validateStartRoleDate(control: FormControl): { [key: string]: any } | null {
    const enteredDate = control.value;
    if (!isNaN(Date.parse(enteredDate))) { // בדיקה האם התאריך שהוזן הוא תאריך חוקי
      const enteredDateObj = new Date(enteredDate);
      if (this.workerToUpdate.startDate && enteredDateObj < this.workerToUpdate.startDate) {
        return null;
      }
    }
    return { 'invalidStartDate': false };
  }


  getGenderKeys() {
    const genderKeys = Object.keys(this.genderType);
    const stringGenderKeys = genderKeys.filter(key => isNaN(Number(key)));
    return stringGenderKeys;
  }


  getRoleNameOptions() {
    const optionsKeys = Object.keys(this.roleNameOptions);
    const stringOptionsKeys = optionsKeys.filter(key => isNaN(Number(key)));
    return stringOptionsKeys;
  }


  homePage() {
    this._router.navigate(['/workerList']);
  }


  cancelUpdate() {
    this.homePage();
  }


  updateWorker() {
    this.workerToUpdate = this.editWorkerForm.value;
    this.workerToUpdate.idNumber = Number(this.workerToUpdate.idNumber);
    this.workerToUpdate.dateOfBirth = new Date(this.workerToUpdate.dateOfBirth!);
    this.workerToUpdate.startDate = new Date(this.workerToUpdate.startDate!);
    this.workerToUpdate.id = Number(localStorage.getItem('workerId')!);
    this._workerService.putWorker(this.workerToUpdate.id!, this.workerToUpdate).subscribe(
      worker => this.workerToUpdate = worker,
      error => console.log(error)
    );
    this.homePage();
  }


  deleteRole(roleToDelete: string) {
    var roleNumber = this.getValueFromEnum(roleToDelete);
    this._roleService.getRoleByNameAndIdWorker(roleNumber!.toString(), this.workerToUpdate.id!).subscribe(
      r => {
        this._roleService.deleteRole(r.id!).subscribe(
          error => console.log(error))
      },
      error => console.log(error)
    );
    this.updateButtons();
  }


  getValueFromEnum(input: string): number {
    for (let key in roleNameOptions) {
      if (roleNameOptions.hasOwnProperty(key)) {
        if (roleNameOptions[key] === input) {
          return Number(key);
        }
      }
    }
    return -1;
  }


  editRole(roleToEdit: string) {
    this.isRoleEdit = true;
    this.IsEditRole = true;
    sessionStorage.setItem("roleToEditId", roleToEdit!);
  }


  addRole(roleToAdd: string) {
    this.isRoleAdd = true;
    this.IsEditRole = true;
    sessionStorage.setItem("roleToAddId", roleToAdd!);

  }

  saveAddRole() {
    debugger;
    var roleToAddServer = this.editRoleForm.value;
    roleToAddServer.workerId = Number(roleToAddServer.workerId);
    var roleNumber = this.getValueFromEnum(sessionStorage.getItem("roleToAddId")!);
    roleToAddServer.roleName = roleNumber;
    this._roleService.getRoleByNameAndIdWorker(roleNumber.toString(), this.workerToUpdate.id!).subscribe(
      r => {
        this._roleService.postRole(r).subscribe(
          error => console.log("r not added!!!"))
      },
      error => console.log(error)
    );

    this._roleService.postRole(roleToAddServer).subscribe(
      r => roleToAddServer = r,
      error => console.log(error)
    );
    this.IsEditRole = false;
    this.isRoleAdd = false;
  }


  saveRoleChanges() {
    var roleToUpdate = this.editRoleForm.value;
    roleToUpdate.workerId = Number(roleToUpdate.workerId);
    let roleNumber = this.getValueFromEnum(sessionStorage.getItem("roleToEditId")!);
    roleToUpdate.roleName = roleNumber;
    this._roleService.getRoleByNameAndIdWorker((roleNumber!.toString()!)!, roleToUpdate.workerId).subscribe(
      r => {
        sessionStorage.setItem("roleToSend", JSON.stringify(r!))
      },
      error => console.log(error)
    );
    this.roleToSend = JSON.parse(sessionStorage.getItem("roleToSend")!);
    this._roleService.putRole(this.roleToSend!.id!, roleToUpdate!).subscribe(
      e => roleToUpdate = e,
      error => console.log(error)
    );
    this.IsEditRole = false;
    this.IsEditRole = false;
  }

  closeModal() {
    this._modalService.dismiss();
  }
}