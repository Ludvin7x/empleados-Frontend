import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule], // Importar RouterModule para usar router-outlet
  templateUrl: './app.component.html', // Cambia a usar templateUrl
  styleUrls: ['./app.component.css'] // Mantén el CSS aquí
})
export class AppComponent {}