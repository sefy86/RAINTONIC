import { Component } from '@angular/core';
import { WeatherService, WeatherData } from '../../services/weather.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// Definizione dell'interfaccia per gestire eventuali errori nelle richieste meteo
export interface Errore {
  error: string | null;
}

@Component({
  selector: 'app-city-search',
  templateUrl: './city-search.component.html',
  styleUrls: ['./city-search.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] // Importa moduli necessari al template del componente
})
export class CitySearchComponent {
  cityName: string = '';
  weatherData: WeatherData | null = null;
  error: string | null = null;
  favoriteCities: string[] = [];

  // WeatherService per gestire le richieste meteo e LocalStorageService per gestire i preferiti
  constructor(private weatherService: WeatherService, private localStorageService: LocalStorageService) {
    this.favoriteCities = this.localStorageService.getFavoriteCities(); // Carica le città preferite dal localStorage all'inizio
  }

  // Funzione per cercare i dati meteo di una città
  searchCity() {
    // Verifica se il nome della città è vuoto o contiene solo spazi bianchi
    if (!this.cityName.trim()) {
      this.error = 'Inserisci un nome di città valido';
      this.weatherData = null; // Reset dei dati meteo
      return;
    }
    // Chiama il servizio meteo per ottenere i dati della città
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

  // Funzione per cercare una città preferita (dal localStorage)
  searchFavoriteCity(city: string) {
    this.cityName = city;
    this.searchCity();
  }

  // Funzione per aggiungere una città ai preferiti
  addToFavorites() {
    if (this.cityName) {
      this.localStorageService.addCityToFavorites(this.cityName);
      this.favoriteCities = this.localStorageService.getFavoriteCities();
    }
  }

  // Funzione per rimuovere una città dai preferiti
  removeFromFavorites(city: string) {
    this.localStorageService.removeCityFromFavorites(city);
    this.favoriteCities = this.localStorageService.getFavoriteCities();
    }
  }
