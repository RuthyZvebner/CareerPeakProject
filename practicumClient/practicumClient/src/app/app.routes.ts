import { Routes } from '@angular/router';
import { WorkerAddComponent } from './modules/worker/worker-add/worker-add.component';
import { WorkerListComponent } from './modules/worker/worker-list/worker-list.component';
import { RoleAddComponent } from './modules/role/role-add/role-add.component';
import { WorkerEditComponent } from './modules/worker/worker-edit/worker-edit.component';
import { HomePageComponent } from './modules/home-page/home-page.component';
import { LoginComponent } from './modules/login/login.component';

export const routes: Routes = [
    { path: "", component: HomePageComponent },
    { path: "homePage", component: HomePageComponent },
    { path: "workerList", component: WorkerListComponent },
    { path: "workerAdd", component: WorkerAddComponent },
    { path: "roleAdd", component: RoleAddComponent },
    { path: "workerEdit", component: WorkerEditComponent },
    { path: "loginForm", component: LoginComponent }
];
