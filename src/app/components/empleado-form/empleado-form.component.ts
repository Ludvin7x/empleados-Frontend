import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { DepartamentosService, Departamento } from '../../services/departamentos.service';
import { EmpleadosService } from '../../services/empleados.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empleado-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './empleado-form.component.html',
})
export class EmpleadoFormComponent implements OnInit {
  empleadoForm: FormGroup;
  departamentos: Departamento[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private departamentosService: DepartamentosService,
    private empleadosService: EmpleadosService,
    private router: Router 
  ) {
    this.empleadoForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      department_id: ['', Validators.required],
      job_title: ['', Validators.required],
      hire_date: ['', Validators.required],
    });
  }

  // Getters para los controles, mejora legibilidad en el template
  get first_name(): AbstractControl {
    return this.empleadoForm.get('first_name')!;
  }
  get last_name(): AbstractControl {
    return this.empleadoForm.get('last_name')!;
  }
  get department_id(): AbstractControl {
    return this.empleadoForm.get('department_id')!;
  }
  get job_title(): AbstractControl {
    return this.empleadoForm.get('job_title')!;
  }
  get hire_date(): AbstractControl {
    return this.empleadoForm.get('hire_date')!;
  }

  ngOnInit(): void {
    this.cargarDepartamentos();
  }

  cargarDepartamentos(): void {
    this.departamentosService.getDepartamentos().subscribe({
      next: (data) => {
        this.departamentos = data;
      },
      error: (error) => {
        console.error('Error cargando departamentos:', error);
        Swal.fire('Error', 'No se pudieron cargar los departamentos.', 'error');
      },
    });
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.empleadoForm.invalid) {
      // Marcar todos los controles como tocados para mostrar mensajes de validación
      this.empleadoForm.markAllAsTouched();
      Swal.fire('Atención', 'Por favor, complete todos los campos requeridos.', 'warning');
      return;
    }

    this.empleadosService.addEmpleado(this.empleadoForm.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Empleado agregado con éxito!',
          confirmButtonText: 'Aceptar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/empleados']);
          }
        });
      },
      error: (error) => {
        console.error('Error al agregar empleado:', error);
        this.errorMessage = error.error?.message || 'Error desconocido, contacte a soporte.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.errorMessage,
        });
      },
    });
  }
}