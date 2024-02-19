import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { StorageService } from '../auth/storage.service';


const URL_BASE: string = environment.Url_BASE;

@Injectable({
  providedIn: 'root'
})
export class AdresseService {

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
  
  //AFFICHER LA LISTE DES PAYS
  AfficherListePeriode(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}/periode/afficher`, { headers });
  }

  //AFFICHER LA LISTE DES PAYS
  AfficherListePays(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}/pays/afficher`, { headers });
  }

   //AFFICHER LA LISTE DES REGIONS
   AfficherListeRegion(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}/region/afficher`, { headers });
  }

   //AFFICHER LA LISTE DES CERCLE
   AfficherListeCercle(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}/cercle/afficher`, { headers });
  }

   //AFFICHER LA LISTE DES COMMUNE
   AfficherListeCommune(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}/commune/afficher`, { headers });
  }

     //AFFICHER LA LISTE DES TYPES BIEN IMMO
     AfficherListeTypeBien(): Observable<any> {
      const headers = this.getHeaders();
      return this.http.get(`${URL_BASE}/typeimmo/afficher`, { headers });
    }

      //AFFICHER LA LISTE DES STATUTS BIEN IMMO
      AfficherListeStatutBien(): Observable<any> {
        const headers = this.getHeaders();
        return this.http.get(`${URL_BASE}/statutbien/afficher`, { headers });
      }
}
