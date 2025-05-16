import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  departamento_id: number; // Asegúrate de usar departamento_id en lugar de departamento
  fecha_contratacion: string;
  nombre_cargo: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  private apiUrl = 'http://127.0.0.1:5000/api/empleados/';

  constructor(private http: HttpClient) {}

  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.apiUrl);
  }

  getEmpleado(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}${id}`); 
  }

  addEmpleado(empleado: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(this.apiUrl, empleado);
  }
  
  updateEmpleado(id: number, empleado: Empleado): Observable<Empleado> {
    return this.http.put<Empleado>(`${this.apiUrl}${id}`, empleado);
  }
  
  deleteEmpleado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}