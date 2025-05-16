import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmpleadosService } from '../../services/empleados.service';
import { DepartamentosService, Departamento } from '../../services/departamentos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empleado-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './empleado-edit.component.html',
  styleUrls: ['./empleado-edit.component.css']
})

export class EmpleadoEditComponent implements OnInit {
  empleadoForm: FormGroup;
  departamentos: Departamento[] = [];
  empleadoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private empleadosService: EmpleadosService,
    private departamentosService: DepartamentosService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.empleadoForm = this.fb.group({
      nombre: [''],
      apellido: [''],
      departamento_id: [''],
      nombre_cargo: [''],
      fecha_contratacion: ['']
    });
  }

  ngOnInit(): void {
    this.cargarDepartamentos();
    this.route.params.subscribe(params => {
      this.empleadoId = +params['id'];
      if (this.empleadoId) {
        this.cargarEmpleado(this.empleadoId);
      }
    });
  }

  cargarDepartamentos(): void {
    this.departamentosService.getDepartamentos().subscribe((data) => {
      this.departamentos = data;
    });
  }

  cargarEmpleado(id: number): void {
    this.empleadosService.getEmpleado(id).subscribe((data) => {
      this.empleadoForm.patchValue(data);
    });
  }

  onSubmit(): void {
    if (this.empleadoForm.valid) {
      if (this.empleadoId) {
        this.empleadosService.updateEmpleado(this.empleadoId, this.empleadoForm.value).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Empleado actualizado con éxito!',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/empleados']); 
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al actualizar el empleado: ' + (error.error.message || 'Error desconocido, contacte a soporte!'),
            });
          }
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Por favor, complete todos los campos requeridos.'
      });
    }
  }
}