import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MercureService {
  private eventSource: EventSource;

  constructor() {
    this.eventSource = new EventSource('URL_VERS_VOTRE_MERCURE_HUB');
    this.eventSource.onmessage = (event) => {
      // Traitez ici les mises à jour reçues du serveur Mercure
      const data = JSON.parse(event.data);
    };
  }

  // Méthode pour s'abonner à un topic Mercure
  subscribeToTopic(topic: string): Observable<any> {
    return new Observable((observer) => {
      this.eventSource.addEventListener(topic, (event) => {
        const data = JSON.parse(event.data);
        observer.next(data);
      });
    });
  }

  // Méthode pour se désabonner d'un topic Mercure
  unsubscribeFromTopic(topic: string) {
    // Supprimez l'écouteur pour ce topic
    // this.eventSource.removeEventListener(topic, ...);
  }
}
