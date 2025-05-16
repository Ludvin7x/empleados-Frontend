import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Departamento {
  id: number; 
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class DepartamentosService {
  private apiUrl = `${environment.apiUrl}/departamentos/`;

  constructor(private http: HttpClient) {}

  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.apiUrl);
  }
}