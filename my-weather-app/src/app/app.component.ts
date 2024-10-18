import { Component } from '@angular/core';
import { CitySearchComponent } from './components/city-search/city-search.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [CitySearchComponent] // Importa il componente di ricerca
})
export class AppComponent {}
