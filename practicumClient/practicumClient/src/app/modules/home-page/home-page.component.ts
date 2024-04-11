import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Route, Router, Routes } from '@angular/router';
import { WorkerListComponent } from '../worker/worker-list/worker-list.component';


const routes: Routes = [
  { path: "workerList", component: WorkerListComponent }
]

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

  constructor(private _router: Router) { }

  workerListNavigate() {
    this._router.navigate(['/workerList']);
  }
}


