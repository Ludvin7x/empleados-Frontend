import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EmpleadosListaComponent } from './empleados-lista.component';
import { EmpleadosService, Empleado } from '../../services/empleados.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('EmpleadosListaComponent', () => {
  let component: EmpleadosListaComponent;
  let fixture: ComponentFixture<EmpleadosListaComponent>;
  let empleadosServiceSpy: jasmine.SpyObj<EmpleadosService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('EmpleadosService', ['getEmpleados', 'deleteEmpleado']);

    await TestBed.configureTestingModule({
      imports: [EmpleadosListaComponent],
      providers: [
        { provide: EmpleadosService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmpleadosListaComponent);
    component = fixture.componentInstance;
    empleadosServiceSpy = TestBed.inject(EmpleadosService) as jasmine.SpyObj<EmpleadosService>;
  });

  it('debe cargar empleados en ngOnInit', () => {
    const empleadosMock: Empleado[] = [{ id: 1, first_name: 'Juan', last_name: 'Pérez', department: { name: 'TI' }, job_title: 'Dev', hire_date: new Date() }];
    empleadosServiceSpy.getEmpleados.and.returnValue(of(empleadosMock));

    component.ngOnInit();

    expect(empleadosServiceSpy.getEmpleados).toHaveBeenCalled();
    expect(component.empleados).toEqual(empleadosMock);
    expect(component.cargando).toBeFalse();
  });

  it('debe manejar error al cargar empleados', () => {
    empleadosServiceSpy.getEmpleados.and.returnValue(throwError(() => new Error('Error')));
    spyOn(console, 'error');

    component.cargarEmpleados();

    expect(component.cargando).toBeFalse();
    expect(console.error).toHaveBeenCalled();
  });

  it('debe eliminar empleado tras confirmación', fakeAsync(() => {
    empleadosServiceSpy.deleteEmpleado.and.returnValue(of({}));
    empleadosServiceSpy.getEmpleados.and.returnValue(of([]));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true }) as any);
    spyOn(component, 'cargarEmpleados');

    component.eliminarEmpleado(1);
    tick();

    expect(empleadosServiceSpy.deleteEmpleado).toHaveBeenCalledWith(1);
    expect(component.cargarEmpleados).toHaveBeenCalled();
  }));

  it('no debe eliminar si no se confirma', fakeAsync(() => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false }) as any);

    component.eliminarEmpleado(1);
    tick();

    expect(empleadosServiceSpy.deleteEmpleado).not.toHaveBeenCalled();
  }));
});