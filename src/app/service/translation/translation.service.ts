import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private currentLanguage: string = 'en'; // Langue par défaut

  private translations: Record<string, Record<string, string>> = {
    en: {
      greeting: 'Hello',
      // Ajoutez d'autres traductions en anglais ici
    },
    fr: {
      greeting: 'Bonjour',
      // Ajoutez d'autres traductions en français ici
    },
    // Ajoutez d'autres langues et traductions ici
  };

  constructor() {}

  setLanguage(lang: string): void {
    this.currentLanguage = lang;
  }

  translate(key: string): string {
    const translation = this.translations[this.currentLanguage][key];
    return translation || key; // Retourne la clé si la traduction n'existe pas
  }
}
