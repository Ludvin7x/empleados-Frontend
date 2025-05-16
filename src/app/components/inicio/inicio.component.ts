import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Importa Router para la navegación manual

@Component({
  selector: 'app-inicio',
  standalone: true,  // Declaración como componente autónomo
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  constructor(private router: Router) {}  // Inyecta el servicio Router

  // Función para navegar manualmente
  goTo(path: string): void {
    this.router.navigate([path]);  // Navega hacia la ruta especificada
  }
}
