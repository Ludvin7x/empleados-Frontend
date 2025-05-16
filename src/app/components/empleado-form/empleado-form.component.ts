import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; 
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DepartamentosService, Departamento } from '../../services/departamentos.service';
import { EmpleadosService } from '../../services/empleados.service';
import Swal from 'sweetalert2'; // Importa SweetAlert2

@Component({
  selector: 'app-empleado-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './empleado-form.component.html',
  styleUrls: ['./empleado-form.component.css']
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
      nombre: [''],
      apellido: [''],
      departamento_id: [''], 
      nombre_cargo: [''],
      fecha_contratacion: [''] 
    });
  }

  ngOnInit(): void {
    this.cargarDepartamentos();
  }

  cargarDepartamentos(): void {
    this.departamentosService.getDepartamentos().subscribe((data) => {
      this.departamentos = data;
    });
  }

  onSubmit(): void {
    if (this.empleadoForm.valid) {
      this.empleadosService.addEmpleado(this.empleadoForm.value).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Empleado agregado con éxito!',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/empleados']);
            }
          });
          this.errorMessage = ''; 
        },
        (error) => {
          console.error('Error al agregar empleado:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al agregar empleado: ' + (error.error.message || 'Error desconocido, contacte a soporte!'),
          });
          this.successMessage = ''; 
        }
      );
    } else {
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
      this.successMessage = ''; 
    }
  }
}