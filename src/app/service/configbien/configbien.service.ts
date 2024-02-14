import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { StorageService } from '../auth/storage.service';


const URL_BASE: string = environment.Url_BASE;

@Injectable({
  providedIn: 'root'
})
export class configbienService {

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

  //AFFICHER LA LISTE DES TYPES DE BIENS
  AfficherListeTypeImmo(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}/typeimmo/afficher`, { headers });
  }

  //AFFICHER LA LISTE DES STATUTS DE BIENS
  AfficherListeStatut(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}/statutbien/afficher`, { headers });
  }


}
