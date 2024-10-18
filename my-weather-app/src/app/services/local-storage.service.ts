import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined'; // Controllo se il codice viene eseguito nel browser
  }

  // Aggiunge una città ai preferiti
  addCityToFavorites(city: string): void {
    if (this.isBrowser()) { // Controlla se siamo nel browser prima di accedere a localStorage
      const favorites = this.getFavoriteCities();
      if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem('favoriteCities', JSON.stringify(favorites));
      }
    }
  }

  // Rimuove una città dai preferiti
  removeCityFromFavorites(city: string): void {
    if (this.isBrowser()) { // Controlla se siamo nel browser
      const favorites = this.getFavoriteCities();
      const updatedFavorites = favorites.filter(favorite => favorite !== city);
      localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites));
    }
  }

  // Recupera le città preferite
  getFavoriteCities(): string[] {
    if (this.isBrowser()) { // Controlla se siamo nel browser
      const favorites = localStorage.getItem('favoriteCities');
      return favorites ? JSON.parse(favorites) : [];
    }
    return []; // Restituisce un array vuoto se non siamo nel browser
  }
}
