import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { StorageService } from '../auth/storage.service';


const URL_BASE: string = environment.Url_BASE;

@Injectable({
  providedIn: 'root'
})
export class CaracteristiqueService {

  private accessToken!: string; // Ajoutez cette ligne

  constructor(private http: HttpClient,
    private storageService: StorageService,) { }


  setAccessToken(token: string) {
    this.accessToken = token;
  }
  // Méthode pour ajouter le token JWT aux en-têtes
  getHeaders(): HttpHeaders {
    const token = this.storageService.getUser().token;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  //AFFICHER LA LISTE DES CARACTERISTIQUE
  AfficherCaracteristique(): Observable<any> {
    return this.http.get(`${URL_BASE}/facture/afficherfactureparuuid`);
  }


}
