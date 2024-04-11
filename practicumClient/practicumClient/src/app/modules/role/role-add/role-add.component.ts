import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role, roleNameOptions } from '../../../models/role.model';
import { Router, Routes } from '@angular/router';
import { WorkerAddComponent } from '../../worker/worker-add/worker-add.component';
import { WorkerListComponent } from '../../worker/worker-list/worker-list.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  { path: "workerAdd", component: WorkerAddComponent },
  { path: "workerList", component: WorkerListComponent }
];

@Component({
  selector: 'app-role-add',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgbModalModule, FormsModule, ReactiveFormsModule],
  templateUrl: './role-add.component.html',
  styleUrl: './role-add.component.css',
  providers: [HttpClient, HttpClientModule]
})

export class RoleAddComponent {
  roleToAdd: Role = new Role()
  roleNameOptions = roleNameOptions;
  startDate = new Date(sessionStorage.getItem('startDate')!);

  addRoleForm: FormGroup = new FormGroup({
    "roleName": new FormControl(""),
    "isManagerial": new FormControl("", [Validators.required, this.validateIsManagerial.bind(this)]),
    "startRoleDate": new FormControl("", [Validators.required, this.validateStartRoleDate.bind(this)]),
    "workerId": new FormControl(localStorage.getItem("workerId")!)
  })

  constructor(private _router: Router) { }

  @Output() roleAdded: EventEmitter<Role> = new EventEmitter<Role>();
  sendRoleToWorker(): void {
    debugger
    const role: Role = this.addRoleForm.value;
    role.workerId = Number(role.workerId);
    this.roleAdded.emit(role);
    console.log("send to the worker add from the role emitter");
    console.log(role);
  }


  validateStartRoleDate(control: FormControl): { [key: string]: any } | null {
    const enteredDate = control.value;
    if (!isNaN(Date.parse(enteredDate))) { // בדיקה האם התאריך שהוזן הוא תאריך חוקי
      const enteredDateObj = new Date(enteredDate);
      if (this.startDate && enteredDateObj >= this.startDate) {
        return null;
      }
    }
    return { 'invalidStartDate': true };
  }


  validateIsManagerial(control: FormControl): { [key: string]: any } | null {
    const isManagerial = control.value;
    if (isManagerial === true || isManagerial === false) {
      return null;
    } else {
      return { 'invalidIsManagerial': true };
    }
  }


  getRoleNameOptionsKey() {
    const roleOptionsKey = Object.keys(this.roleNameOptions);
    const stringRoleOptionsKey = roleOptionsKey.filter(key => isNaN(Number(key)));
    return stringRoleOptionsKey;
  }

  homePage() {
    this._router.navigate(['/workerList']);
  }
}