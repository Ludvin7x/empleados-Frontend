import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EmpleadosListaComponent } from './empleados-lista.component';
import { EmpleadosService, Empleado } from '../../services/empleados.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { LucideAngularModule } from 'lucide-angular';

// Mock de Swal.fire para evitar popups reales en tests
spyOn(Swal, 'fire').and.callFake(() => Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false }));

describe('EmpleadosListaComponent', () => {
  let component: EmpleadosListaComponent;
  let fixture: ComponentFixture<EmpleadosListaComponent>;
  let empleadosServiceSpy: jasmine.SpyObj<EmpleadosService>;

  const empleadosMock: Empleado[] = [
    { id: 1, first_name: 'Juan', last_name: 'Perez', department: { id: 1, name: 'IT' }, job_title: 'Dev', hire_date: new Date() as any },
    { id: 2, first_name: 'Ana', last_name: 'Gomez', department: { id: 2, name: 'HR' }, job_title: 'HR Manager', hire_date: new Date() as any }
  ];

  beforeEach(waitForAsync(() => {
    const spy = jasmine.createSpyObj('EmpleadosService', ['getEmpleados', 'deleteEmpleado']);

    TestBed.configureTestingModule({
      imports: [EmpleadosListaComponent, MatProgressSpinnerModule, RouterTestingModule, LucideAngularModule],
      providers: [
        { provide: EmpleadosService, useValue: spy }
      ]
    }).compileComponents();

    empleadosServiceSpy = TestBed.inject(EmpleadosService) as jasmine.SpyObj<EmpleadosService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadosListaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load empleados on init', () => {
    empleadosServiceSpy.getEmpleados.and.returnValue(of(empleadosMock));
    fixture.detectChanges(); // ngOnInit

    expect(component.cargando).toBeFalse();
    expect(component.empleados.length).toBe(2);
    expect(component.empleados).toEqual(empleadosMock);
  });

  it('should handle error on cargarEmpleados', () => {
    empleadosServiceSpy.getEmpleados.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();

    expect(component.cargando).toBeFalse();
    expect(component.empleados.length).toBe(0);
  });

  it('should call deleteEmpleado and reload list when confirmed', async () => {
    empleadosServiceSpy.deleteEmpleado.and.returnValue(of(undefined));
    empleadosServiceSpy.getEmpleados.and.returnValue(of(empleadosMock));

    // Mock Swal.fire to resolve with isConfirmed: true
    (Swal.fire as jasmine.Spy).and.returnValue(Promise.resolve({ isConfirmed: true }));

    fixture.detectChanges();

    await component.eliminarEmpleado(1);

    expect(empleadosServiceSpy.deleteEmpleado).toHaveBeenCalledWith(1);
    expect(empleadosServiceSpy.getEmpleados).toHaveBeenCalled();
  });

  it('should not call deleteEmpleado if confirmation is canceled', async () => {
    (Swal.fire as jasmine.Spy).and.returnValue(Promise.resolve({ isConfirmed: false }));

    fixture.detectChanges();

    await component.eliminarEmpleado(1);

    expect(empleadosServiceSpy.deleteEmpleado).not.toHaveBeenCalled();
  });
});