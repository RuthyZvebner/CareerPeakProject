import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, Routes } from '@angular/router';
import { WorkerService } from './services/worker.service';
import { RoleService } from './services/role.service';
import { HttpClient, HttpHeaders, provideHttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { WorkerListComponent } from './modules/worker/worker-list/worker-list.component';
import { HomePageComponent } from './modules/home-page/home-page.component';
import { LoginComponent } from './modules/login/login.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  { path: "homePage", component: HomePageComponent },
  { path: "loginForm", component: LoginComponent }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterOutlet, WorkerListComponent, HttpClientModule],
  providers: [HttpClient, WorkerService, RoleService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
  [x: string]: any;
  title = 'careerPeak';
  authUrl!: string;
  private oauth2Client!: any;


  constructor(private _router: Router, private _http: HttpClient, private _modalService: NgbModal) {
  }

  homePage() {
    this._router.navigate(['/homePage'])
  }

  loginForm() {
    this._modalService.open(LoginComponent, { centered: true }); // Open the login modal
  };

  logOut(){
    console.log("logout");
    sessionStorage.removeItem('token');
    console.log(sessionStorage['token']);
  }

  
  sendEmail(): Promise<void> {
    const sender = 'example@example.com';
    const to = 'recipient@example.com';
    const subject = 'Test Subject';
    const body = 'Test Body';

    const emailData = {
      sender: sender,
      to: to,
      subject: subject,
      body: body
    };

    return this._http.post<void>('/api/sendEmail', emailData).toPromise();
  }

}
