import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmpleadosService, Empleado } from '../../services/empleados.service'; 
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

  constructor(private empleadosService: EmpleadosService) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.empleadosService.getEmpleados().subscribe(data => {
      this.empleados = data;
    });
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
            Swal.fire('Eliminado', 'Empleado eliminado con éxito.', 'success');
          },
          error: (error) => {
            Swal.fire('Error', 'No se pudo eliminar el empleado.', 'error');
            console.error(error);
          }
        });
      }
    });
  }
}