import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GeocodeResponse {
  results: {
    geometry: {
      lat: number; // Latitudine
      lng: number; // Longitudine
    };
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private apiUrl = 'https://api.opencagedata.com/geocode/v1/json'; // Endpoint di OpenCage
  private apiKey = 'd6720209d37645ffbf2fdc762229aace';

  constructor(private http: HttpClient) {}

  // Metodo per ottenere le coordinate di una città
  getCoordinates(city: string): Observable<GeocodeResponse> {
    return this.http.get<GeocodeResponse>(`${this.apiUrl}?q=${encodeURIComponent(city)}&key=${this.apiKey}`);
  }
}
