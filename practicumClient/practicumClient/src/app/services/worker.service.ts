import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { Worker } from "../models/worker.model";

@Injectable({
    providedIn: 'root'
})

export class WorkerService {

    path: string = "https://localhost:7253/api/Worker";
    worker?: Worker[];
    id: number = 0;

    getWorkers(): Observable<Worker[]> {
        return this._http.get<Worker[]>(`${this.path}`);
    }

    getWorkerById(id: number): Observable<Worker> {
        return this._http.get<Worker>(`${this.path}/${id}`);
    }

    getWorkerByName(name: string): Observable<Worker[]> {
        return this._http.get<Worker[]>(`${this.path}/name/${name}`);
    }

    postWorker(worker: Worker): Observable<Worker> {debugger;
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });
        worker.id = 0;
        return this._http.post<Worker>(`${this.path}`, worker, { headers });
      }
      

    putWorker(id: number, worker: Worker): Observable<Worker> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });
        return this._http.put<Worker>(`${this.path}/${id}`, worker, { headers });
    }

    deleteWorker(id: number): Observable<void> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });
        return this._http.delete<void>(`${this.path}/${id}`, { headers });
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        return throwError('Something bad happened; please try again later.');
    }

    constructor(private _http: HttpClient) { }
}