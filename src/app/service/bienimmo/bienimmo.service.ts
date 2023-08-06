
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const custom_header_value = 'frontend'
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    //'Authorization': 'Bearer your_access_token', // Remplacez par le véritable jeton d'accès si nécessaire
    //'X-Custom-Auth': custom_header_value, // Si vous avez un en-tête personnalisé
  }),
};
const URL_BASE: string = environment.Url_BASE;

@Injectable({
  providedIn: 'root'
})
export class BienimmoService {

  // API_URL = 'http://192.168.1.6:8000/api/bien/immo';

  constructor(private http: HttpClient) { }

    //AFFICHER LA LISTE DES BIENS IMMO
    AfficherLaListeBienImmo():Observable<any>{
      return this.http.get(`${URL_BASE}/bien/immo`);
    }
    //AFFICHER LA LISTE DES BIENS IMMO RECENTS A LOUER
    AfficherLaListeBienImmoRecentAlouer():Observable<any>{
      return this.http.get(`${URL_BASE}/bien/immo/statut/A louer`);
    }

     //AFFICHER LA LISTE DES BIENS IMMO  A VENDRE
     AfficherLaListeBienImmoAvendre():Observable<any>{
      return this.http.get(`${URL_BASE}/bien/immo/statut/A vendre`);
    }

    //AFFICHER UN BIEN IMMO EN FONCTION DE SON ID
    AfficherBienImmoParId(id: number):Observable<any>{
      return this.http.get(`${URL_BASE}/bien/immo/${id}`);
    }

    //AFFICHER LA LISTE DES BIENS EN FONCTION DE LA COMMUNE
    AfficherBienImmoParCommune(id: number):Observable<any>{
      return this.http.get(`${URL_BASE}/bien/immo/commune/${id}`);
    }

     //AFFICHER LA LISTE DES BIENS EN FONCTION DE L'UTILISATEUR
     AfficherBienImmoParUser(id: number):Observable<any>{
      return this.http.get(`${URL_BASE}/bien/immo/user/${id}`);
    }
}
