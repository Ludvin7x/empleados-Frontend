import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, LucideAngularModule],
  templateUrl: './inicio.component.html',
})
export class InicioComponent {
  constructor(private router: Router) {}

  goTo(path: string): void {
    this.router.navigate([path]);
  }
}