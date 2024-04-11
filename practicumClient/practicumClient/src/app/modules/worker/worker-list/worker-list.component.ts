import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { WorkerService } from '../../../services/worker.service';
import { Worker } from '../../../models/worker.model';
import { RouterModule, Routes } from '@angular/router';
import { Router } from '@angular/router';
import { WorkerEditComponent } from '../worker-edit/worker-edit.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { WorkerAddComponent } from '../worker-add/worker-add.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../../login/login.component';


const routes: Routes = [
  { path: "workerAdd", component: WorkerAddComponent },
  { path: "workerEdit", component: WorkerEditComponent }
];

@Component({
  selector: 'app-worker-list',
  standalone: true,
  templateUrl: './worker-list.component.html',
  styleUrl: './worker-list.component.css',
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule, ReactiveFormsModule, WorkerAddComponent],
  providers: [HttpClient, HttpClientModule, WorkerService]
})

export class WorkerListComponent {
  workers: Worker[] = [];
  workerToUpdate: Worker = new Worker();
  showSearch: boolean = false;
  showForm: boolean = false;
  searchControl: FormControl = new FormControl('');
  newFormOpen: boolean = false;
  isModalOpen: boolean = false;
  showModal: boolean = false;


  constructor(private _workerService: WorkerService, private _router: Router, private _modalService: NgbModal) {
  }

  ngOnInit() {
    this._workerService.getWorkers().subscribe(
      workerService => this.workers = workerService,
      error => console.log(error));
  }

  open() {
    if (this.checkLogin()) {
      const modalRef = this._modalService.open(WorkerAddComponent);
      modalRef.componentInstance.name = 'World';
      modalRef.componentInstance.onPostCreate.subscribe((res: any) => {
        this._workerService.getWorkers().subscribe(
          w => this.workers = w,
          error => console.log(error)
        )
      })
    }
  }

  deleteWorker(workerId: number) {
    if (this.checkLogin()) {
      this._workerService.deleteWorker(workerId).subscribe((res) => {
        this._workerService.getWorkers().subscribe(
          w => this.workers = w,
          error => console.log(error)
        );
      })
    }
  }

  updateWorker(worker: Worker, id: number) {
    if (this.checkLogin()) {
      localStorage.setItem('worker', JSON.stringify(worker));
      localStorage.setItem('workerId', id.toString());
      localStorage.setItem('gender', worker.gender?.toString()!)
      this._modalService.open(WorkerEditComponent, { centered: true });
    }
  }


  addWorker() {
    this.showModal = true;
    this.newFormOpen = true;
  }


  getWorkers() {
    this._workerService.getWorkers().subscribe(
      workerService => this.workers = workerService,
      error => console.log(error)
    );
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    this._workerService.getWorkers().subscribe(
      workers => this.workers = workers,
      error => console.log(error)
    );
    if (!this.showSearch) {
      this.clearSearch();
    }
  }

  search() {
    if (this.searchControl.value.trim() !== '') {
      this._workerService.getWorkerByName(this.searchControl.value).subscribe(
        workers => this.workers = workers,
        error => console.log(error)
      );
    } else {
      this.getWorkers();
    }
  }

  
  clearSearch() {
    this.searchControl.setValue('');
    this.getWorkers();
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.isClickInsideSearch(event)) {
      this.showSearch = false;
    }
  }


  private isClickInsideSearch(event: MouseEvent): boolean {
    const targetElement = event.target as HTMLElement;
    return !!targetElement.closest('.col');
  }


  downloadAsExcel() {
    const data = this.workers.map(worker => {
      return {
        ID: worker.idNumber!.toString(),
        'First Name': worker.firstName,
        'Last Name': worker.lastName,
        'Start Date': worker.startDate?.toString(),
        'Date of Birth': worker.dateOfBirth?.toString(),
        'Gender': worker.gender,
        'Status': worker.status ? 'Active' : 'Inactive',
      };
    });
    const dataToSave = data.filter(worker => worker.Status == 'Active');
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToSave);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Workers');
    XLSX.writeFile(wb, 'workers.xlsx');
  }

  checkLogin(): boolean {
    if (!sessionStorage['token'] || sessionStorage['token'] === '') {
      this.openLoginModal();
      return false;
    }
    return true;
  }

  openLoginModal() {
    this._modalService.open(LoginComponent, { centered: true });
  }
}




