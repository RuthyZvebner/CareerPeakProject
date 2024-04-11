import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role } from '../models/role.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  path: string = "https://localhost:7253/api/Role"
  roles?: Role[]
  role: Role = new Role();

  getRole(): Observable<Role[]> {
    return this._http.get<Role[]>(`${this.path}`)
  }

  getRoleById(id: number): Observable<Role> {
    return this._http.get<Role>(`${this.path}/${id}`)
  }


  getRoleByNameAndIdWorker(name: string, id: number): Observable<Role> {
    return this._http.get<Role>(`${this.path}/${name}/${id}`);
  }


  getRolesByWorkerId(idWorker: number): Observable<Role[]> {
    return this._http.get<Role[]>(`${this.path}/workerId/${idWorker}`);
  }


  postRole(role: Role): Observable<Role> {
    return this._http.post<Role>(`${this.path}`, role)
  }

  postRoles(workerId: number, roles: Role[]): Observable<Role[]> {
    console.log("post roles service id worker");
    console.log(workerId);
    return this._http.post<Role[]>(`${this.path}/${workerId}`, roles);
  }


  putRole(id: number, role: Role): Observable<Role> {
    return this._http.put<Role>(`${this.path}/${id}`, role)
  }

  deleteRole(id: number): Observable<void> {
    return this._http.delete<void>(`${this.path}/${id}`)
  }

  constructor(private _http: HttpClient) { }
}
