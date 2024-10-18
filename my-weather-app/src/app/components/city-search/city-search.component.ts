import { Component } from '@angular/core';
import { WeatherService, WeatherData } from '../../services/weather.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// Definizione dell'interfaccia WeatherData che rappresenta la risposta API
export interface Errore {
  error: string | null;
}

@Component({
  selector: 'app-city-search',
  templateUrl: './city-search.component.html',
  styleUrls: ['./city-search.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CitySearchComponent {
  cityName: string = '';
  weatherData: WeatherData | null = null;
  error: string | null = null;
  favoriteCities: string[] = [];

  constructor(private weatherService: WeatherService, private localStorageService: LocalStorageService) {
    this.favoriteCities = this.localStorageService.getFavoriteCities();
  }


  searchCity() {

    if (!this.cityName.trim()) {
      this.error = 'Inserisci un nome di città valido';
      this.weatherData = null;
      return;
    }

    this.weatherService.getWeather(this.cityName).pipe(
      catchError(err => {
        this.error = 'Errore nel recuperare i dati meteo';
        this.weatherData = null;

        return of(null); // Restituisci null in caso di errore
      })
    ).subscribe(
      (data: WeatherData | null) => {
        if (data) { // Controlla se i dati non sono null
          this.weatherData = data;
          this.error = null;
        } else {
          this.weatherData = null;
        }
      }
    );
  }


  searchFavoriteCity(city: string) {
    this.cityName = city;  // Imposta il nome della città selezionata
    this.searchCity();     // Esegui la ricerca
  }

  addToFavorites() {
    if (this.cityName) {
      this.localStorageService.addCityToFavorites(this.cityName);
      this.favoriteCities = this.localStorageService.getFavoriteCities();
    }
  }

  removeFromFavorites(city: string) {
    this.localStorageService.removeCityFromFavorites(city);
    this.favoriteCities = this.localStorageService.getFavoriteCities();
    }
  }
