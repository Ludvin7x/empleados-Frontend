import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmpleadosService, Empleado } from '../../services/empleados.service';
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
      first_name: [''],
      last_name: [''],
      department_id: [''],
      job_title: [''],
      hire_date: ['']
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
    this.departamentosService.getDepartamentos().subscribe((data: Departamento[]) => {
      this.departamentos = data;
    });
  }

  cargarEmpleado(id: number): void {
    this.empleadosService.getEmpleado(id).subscribe((data: Empleado) => {
      this.empleadoForm.patchValue({
        first_name: data.first_name,
        last_name: data.last_name,
        department_id: data.department?.id || null,
        job_title: data.job_title,
        hire_date: data.hire_date
      });
    });
  }

  onSubmit(): void {
    if (this.empleadoForm.valid) {
      if (this.empleadoId) {
        this.empleadosService.updateEmpleado(this.empleadoId, this.empleadoForm.value).subscribe({
          next: (response: Empleado) => {
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Empleado actualizado con éxito!',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/empleados']);
            });
          },
          error: (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al actualizar el empleado: ' + (error.error?.message || 'Error desconocido, contacte a soporte!'),
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