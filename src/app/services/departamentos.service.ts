import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Departamento {
  id: number; 
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class DepartamentosService {
  private apiUrl = 'http://127.0.0.1:5000/api/departamentos/';

  constructor(private http: HttpClient) {}

  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.apiUrl);
  }
}