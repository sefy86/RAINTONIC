import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeocodingService, GeocodeResponse } from './geocoding.service';
import { switchMap, map } from 'rxjs/operators';

// Interfaccia che definisce la struttura dei dati meteo restituiti dall'API
export interface WeatherData {
  temperature: number;
  windSpeed: number;
  humidity: number;
  city: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'https://api.open-meteo.com/v1/forecast';

  // Inietta HttpClient per le richieste HTTP e GeocodingService per ottenere le coordinate geografiche
  constructor(private http: HttpClient, private geocodingService: GeocodingService) {}

  // Metodo che restituisce un Observable con i dati meteo di una città
  getWeather(city: string): Observable<WeatherData> {
    return this.geocodingService.getCoordinates(city).pipe(
      switchMap((geocodeResponse: GeocodeResponse) => {
        if (!geocodeResponse.results || geocodeResponse.results.length === 0) {
          throw new Error('Nessuna coordinata trovata');
        }
        const coordinates = geocodeResponse.results[0].geometry; // Prende la geometria delle coordinate
        const url = `${this.apiUrl}?latitude=${coordinates.lat}&longitude=${coordinates.lng}&current_weather=true&humidity_2m=true`;
        return this.http.get<any>(url);
      }),
      map(data => ({
        temperature: data.current_weather.temperature,
        windSpeed: data.current_weather.windspeed,
        humidity: data.current_weather.humidity_2m,
        city: city
      }))
    );
  }

}
