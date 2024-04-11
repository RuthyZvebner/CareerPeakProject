import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgbModalModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [HttpClient, HttpClientModule]
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  divMessage = false;

  @ViewChild('myModal') myModal!: ElementRef;

  constructor(
    private fb: FormBuilder, private _http: HttpClient, private _router: Router, public _modalService: NgbActiveModal, private modalService: NgbModal) {
    this.loginForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  @ViewChild('invalidValuesModal') invalidValuesModal: any;


  ngOnInit() {
    this.loginForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.divMessage = true;
      this.loginForm.reset();
      return;
    }

    const loginModel = this.loginForm.value;
    this._http.post<any>('https://localhost:7253/api/Auth', loginModel)
      .pipe(
        tap(response => {
          const token = response.token;
          console.log("token", token);
          this.sendTokenToServer(token);
          sessionStorage.setItem('token', token);
          this._router.navigate(['/workerList']);
        }),
        catchError(error => {
          return throwError(error);
        })
      ).subscribe();
    this.closeModal();
  }

  private sendTokenToServer(token: string): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  closeModal() {
    this._modalService.dismiss();
  }
}
