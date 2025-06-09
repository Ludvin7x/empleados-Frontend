import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmpleadosService, Empleado } from '../../services/empleados.service';
import Swal from 'sweetalert2';
import { LucideAngularModule } from 'lucide-angular';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-empleados-lista',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './empleados-lista.component.html',
})
export class EmpleadosListaComponent implements OnInit {
  empleados: Empleado[] = [];
  cargando: boolean = true;

  constructor(private empleadosService: EmpleadosService) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.cargando = true;
    this.empleadosService.getEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener empleados', error);
        this.cargando = false;
      }
    });
  }

  eliminarEmpleado(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb', // azul-600
      cancelButtonColor: '#ef4444',  // rojo-500
      confirmButtonText: 'Sí, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.empleadosService.deleteEmpleado(id).subscribe({
          next: () => {
            this.cargarEmpleados();
            Swal.fire('Eliminado', 'Empleado eliminado con éxito.', 'success');
          },
          error: (error) => {
            Swal.fire('Error', 'No se pudo eliminar el empleado.', 'error');
            console.error(error);
          },
        });
      }
    });
  }
}