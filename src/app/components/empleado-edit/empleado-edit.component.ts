import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { EmpleadosService, Empleado } from '../../services/empleados.service';
import { DepartamentosService, Departamento } from '../../services/departamentos.service';
import Swal from 'sweetalert2';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-empleado-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './empleado-edit.component.html',
})
export class EmpleadoEditComponent implements OnInit {
  empleadoForm: FormGroup;
  departamentos: Departamento[] = [];
  empleadoId: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private empleadosService: EmpleadosService,
    private departamentosService: DepartamentosService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.empleadoForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      department_id: ['', Validators.required],
      job_title: ['', Validators.required],
      hire_date: ['', [Validators.required, this.fechaNoFuturaValidator]]
    });
  }

  ngOnInit(): void {
    this.cargarDepartamentos();
    this.route.params.subscribe(params => {
      this.empleadoId = params['id'] ? +params['id'] : null;
      if (this.empleadoId) {
        this.cargarEmpleado(this.empleadoId);
      }
    });
  }

  cargarDepartamentos(): void {
    this.departamentosService.getDepartamentos().subscribe({
      next: (data: Departamento[]) => {
        this.departamentos = data;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los departamentos.';
      }
    });
  }

  cargarEmpleado(id: number): void {
    this.empleadosService.getEmpleado(id).subscribe({
      next: (data: Empleado) => {
        this.empleadoForm.patchValue({
          first_name: data.first_name,
          last_name: data.last_name,
          department_id: data.department?.id || '',
          job_title: data.job_title,
          hire_date: data.hire_date
        });
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el empleado.';
      }
    });
  }

  fechaNoFuturaValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const fecha = new Date(control.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fecha > hoy) {
      return { max: true };
    }
    return null;
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.empleadoForm.invalid) {
      this.empleadoForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Por favor, complete correctamente todos los campos requeridos.'
      });
      return;
    }

    const empleadoData = this.empleadoForm.value;

    if (this.empleadoId) {
      this.empleadosService.updateEmpleado(this.empleadoId, empleadoData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Empleado actualizado con éxito!',
            confirmButtonText: 'OK'
          }).then(() => this.router.navigate(['/empleados']));
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al actualizar el empleado: ' + (error.error?.message || 'Error desconocido, contacte a soporte!'),
          });
        }
      });
    } 
  }
}