import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmpleadosService, Empleado } from '../../services/empleados.service';
import { DepartamentosService, Departamento } from '../../services/departamentos.service'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empleados-lista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './empleados-lista.component.html',
  styleUrls: ['./empleados-lista.component.css']
})
export class EmpleadosListaComponent implements OnInit {
  empleados: Empleado[] = [];
  departamentos: Departamento[] = []; 

  constructor(
    private empleadosService: EmpleadosService,
    private departamentosService: DepartamentosService 
  ) {}

  ngOnInit(): void {
    this.cargarEmpleados();
    this.cargarDepartamentos(); 
  }

  cargarEmpleados(): void {
    this.empleadosService.getEmpleados().subscribe((data) => {
      this.empleados = data;
    });
  }

  cargarDepartamentos(): void {
    this.departamentosService.getDepartamentos().subscribe((data) => {
      this.departamentos = data; 
    });
  }

  obtenerNombreDepartamento(departamentoId: number): string {
    const departamento = this.departamentos.find(dept => dept.id === departamentoId);
    return departamento ? departamento.nombre : 'Desconocido'; 
  }

  eliminarEmpleado(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás deshacer esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.empleadosService.deleteEmpleado(id).subscribe({
          next: () => {
            this.cargarEmpleados(); 
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'Empleado eliminado con éxito.',
            });
          },
          error: (error) => {
            console.error('Error al eliminar el empleado:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al eliminar el empleado: ' + error.message,
            });
          }
        });
      }
    });
  }
}